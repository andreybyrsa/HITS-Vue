<script lang="ts" setup>
import { reactive, ref, VueElement } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import { HTMLInputEvent } from '@Components/Inputs/Input/Input.types'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { InviteUsersForm } from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'
import RolesTypes from '@Domain/Roles'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'
import getRoles from '@Utils/getRoles'

const currentRoles = getRoles()

const fileInput = ref<VueElement>()
const loadedFileText = ref('')

const response = reactive<ResponseMessage>({
  success: '',
  error: '',
})

function clearResponseMessages() {
  response.success = ''
  response.error = ''
}

const { errors, submitCount, handleSubmit } = useForm<InviteUsersForm>({
  validationSchema: {
    emails: (value: string[]) =>
      value?.every((email) => Validation.checkEmail(email)),
    roles: (value: RolesTypes[]) => value?.length,
  },
  initialValues: {
    emails: [''],
    roles: [],
  },
})

const { fields, push, remove } = useFieldArray<string>('emails')

function getError(email: string) {
  if (submitCount.value && !Validation.checkEmail(email)) {
    return 'Неверно введена почта'
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
  }
}

const handleInvite = handleSubmit(async (values) => {
  const { success, error } = await InvitationService.inviteUsers(values)
  clearResponseMessages()

  response.success = success
  response.error = error
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
            :error="getError(field.value)"
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
          icon-name="bi bi-plus-lg"
          @click="push('')"
        >
          Добавить почту
        </Button>

        <Button
          type="button"
          class-name="btn-primary fs-6"
          icon-name="bi bi-file-earmark"
          @click="fileInput?.click()"
        >
          Загрузить файл
        </Button>

        <Button
          id="checkboxRoles"
          type="button"
          :class-name="errors.roles ? 'btn-danger fs-6' : 'btn-primary fs-6'"
          icon-name="bi bi-plus-lg"
          is-drop-down-controller
        >
          Выбрать роли
        </Button>
      </div>
    </div>

    <DropDown
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
    </DropDown>

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleInvite"
    >
      Добавить
    </Button>

    <Typography
      v-if="response.success || response.error"
      :class-name="response.success ? 'text-success fs-6' : 'text-danger fs-6'"
    >
      {{ response.success || response.error }}
    </Typography>
  </FormLayout>
</template>

<style lang="scss">
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
