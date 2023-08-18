<script lang="ts" setup>
import { onMounted, ref, VueElement } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import { HTMLInputEvent } from '@Components/Inputs/Input/Input.types'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { InviteUsersForm } from '@Domain/Invitation'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import InvitationService from '@Services/InvitationService'
import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'
import getRoles from '@Utils/getRoles'
import useNotification from '@Utils/useNotification'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const currentRoles = getRoles()
const DBUsersEmails = ref<string[]>([])

const isEditing = ref<boolean>(false)
const fileInput = ref<VueElement>()
const loadedFileText = ref('')

const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { emails, error } = await ManageUsersService.getUsersEmails(token)

    if (emails) {
      DBUsersEmails.value = emails
    } else {
      handleOpenNotification('error', error)
    }
  }
})

const { values, errors, resetForm, submitCount, handleSubmit } =
  useForm<InviteUsersForm>({
    validationSchema: {
      emails: (value: string[]) =>
        value?.every((email) => Validation.checkEmail(email)),
      roles: (value: RolesTypes[]) => {
        if (submitCount.value) {
          return value?.length
        }
        return true
      },
    },
    initialValues: {
      emails: [''],
      roles: [],
    },
  })

const { fields, push, move, remove } = useFieldArray<string>('emails')

const moveErrorEmail = async (index: number) => {
  const prevEmail = values.emails[index - 1]

  if (
    index > 0 &&
    !isEditing.value &&
    Validation.checkEmail(prevEmail) &&
    !DBUsersEmails.value.includes(prevEmail)
  ) {
    move(index, 0)
  }
}

function getError(email: string, index: number) {
  if (submitCount.value && !Validation.checkEmail(email)) {
    moveErrorEmail(index)
    return 'Неверно введена почта'
  }
  if (submitCount.value && DBUsersEmails.value.includes(email)) {
    moveErrorEmail(index)
    return 'Почта уже зарегистрирована'
  }
  return undefined
}

function handleFileChange(event: HTMLInputEvent) {
  const rawFile = event.target.files?.length && event.target.files[0]

  if (rawFile) {
    const fileURL = URL.createObjectURL(rawFile)

    fetch(fileURL)
      .then((response) => response.text())
      .then((text) => {
        const regExpPattern = /[a-zA-Z_.-{0,9}]+@[a-zA-Z_]+\.[a-zA-Z]{2,10}$/gm
        const emails = text.split('\n')

        const formattedEmails = text.match(regExpPattern)
        if (formattedEmails) {
          formattedEmails.forEach((email) => push(email))

          loadedFileText.value = `Загружено ${formattedEmails.length} из ${emails.length}`
        }
      })
      .catch(({ response }) => {
        const error = response ? response.data.error : 'Ошибка загрузки файла'
        handleOpenNotification('error', error)
      })
  }
}

const handleInvite = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const { success, error } = await InvitationService.inviteUsers(
      values,
      token,
    )

    if (success) {
      handleOpenNotification('success', success)

      resetForm()
    } else {
      handleOpenNotification('error', error)
    }
  }
})
</script>

<template>
  <FormLayout class-name="add-users-form">
    <Typography class-name="fs-3 text-primary">
      Добавление пользователей
    </Typography>

    <div class="add-users-form__content w-100">
      <div class="add-users-form__inputs w-100 p-1">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="add-users-form__input"
        >
          <Input
            type="email"
            :name="`emails[${index}]`"
            @focus="isEditing = true"
            @blur="isEditing = false"
            :error="getError(field.value, index)"
            placeholder="Введите email"
            prepend="@"
          />

          <Button
            v-if="fields.length > 1"
            class-name="btn-close mt-2"
            @click="remove(index)"
          ></Button>
        </div>
      </div>

      <input
        type="file"
        ref="fileInput"
        @change="(event) => handleFileChange(event as HTMLInputEvent)"
        hidden
      />
      <Typography
        v-if="loadedFileText"
        class-name="text-success text-center"
      >
        {{ loadedFileText }}
      </Typography>

      <div class="add-users-form__settings">
        <Button
          type="button"
          class-name="btn-primary fs-6"
          prepend-icon-name="bi bi-plus-lg"
          @click="push('')"
        >
          Добавить почту
        </Button>

        <Button
          type="button"
          class-name="btn-primary fs-6"
          prepend-icon-name="bi bi-file-earmark"
          @click="fileInput?.click()"
        >
          Загрузить файл
        </Button>

        <Button
          id="checkboxRoles"
          type="button"
          :class-name="errors.roles ? 'btn-danger fs-6' : 'btn-primary fs-6'"
          prepend-icon-name="bi bi-plus-lg"
          is-collapse-controller
        >
          Выбрать роли
        </Button>
      </div>
    </div>

    <Collapse
      id="checkboxRoles"
      class-name="w-100"
    >
      <Checkbox
        v-for="role in currentRoles.roles"
        :key="role"
        name="roles"
        :value="role"
        :label="currentRoles.translatedRoles[role]"
      />
    </Collapse>

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleInvite"
    >
      Добавить
    </Button>

    <NotificationModal
      :type="responseMessage.type"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
      :time-expired="5000"
    >
      {{ responseMessage.message }}
    </NotificationModal>
  </FormLayout>
</template>

<style lang="scss" scoped>
.add-users-form {
  width: 600px;

  &__content {
    @include flexible(stretch, space-between, column, $gap: 16px);
  }

  &__inputs {
    max-height: 250px;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__input {
    @include flexible(flex-start, flex-start, $gap: 8px);
  }

  &__settings {
    @include flexible(center, center, $gap: 16px);
  }
}
</style>
