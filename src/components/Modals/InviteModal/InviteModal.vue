<script lang="ts" setup>
import { VueElement, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMagicKeys } from '@vueuse/core'
import { useFieldArray, useForm } from 'vee-validate'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  InviteModalEmits,
  InviteModalProps,
  InviteFromOutsideForm,
} from '@Components/Modals/InviteModal/InviteModal.types'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import FormInputs from '@Components/Forms/AddUsersForm/FormInputs.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'

defineProps<InviteModalProps>()

const emit = defineEmits<InviteModalEmits>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const { enter } = useMagicKeys()

const selectedUsers = ref<User[]>([])
const unselectedUsers = ref<User[]>()

const isFromPortal = ref<boolean>(true)

watch(enter, () => {
  emit('close-modal')
})

const fileInputRef = ref<VueElement | null>(null)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return
    }
    unselectedUsers.value = response
  }
})

const handleInviteFromPortal = async () => {
  if (selectedUsers.value) {
    emit('inviteFromPortal', selectedUsers.value)
    unselectedUsers.value?.push(...selectedUsers.value)
    unselectedUsers.value?.sort()
    selectedUsers.value = []
  } else {
    return
  }
}

const { resetForm, submitCount, handleSubmit } = useForm<InviteFromOutsideForm>({
  validationSchema: {
    emails: (value: string[]) =>
      value?.every((email) => Validation.checkEmail(email)),
  },
  initialValues: {
    emails: [''],
  },
})
const { fields, push, move, remove } = useFieldArray<string>('emails')

const handleInviteFromOutside = handleSubmit(async (values) => {
  emit('inviteFromOutside', values.emails)
  resetForm()
})

function selectUser(index: number) {
  if (unselectedUsers.value) {
    selectedUsers.value.push(...unselectedUsers.value.splice(index, 1))
  }
}

function unselectUser(index: number) {
  if (unselectedUsers.value) {
    unselectedUsers.value.push(...selectedUsers.value.splice(index, 1))
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invite-modal p-3 rounded bg-white">
      <div class="invite-modal__switch-buttons">
        <Button
          class-name="rounded btn-light fs-8"
          v-model="isFromPortal"
          @click="() => (isFromPortal = true)"
        >
          пригласить пользователя с портала сайта</Button
        >

        <Button
          class-name="rounded btn-light fs-8"
          v-model="isFromPortal"
          @click="() => (isFromPortal = false)"
        >
          пригласить нового пользователя</Button
        >
      </div>
      <div v-if="isFromPortal">
        <div v-if="unselectedUsers">
          <div class="d-flex justify-content-between">
            <div class="selectors">
              <Typography class-name="fs-6 text-primary">
                Невыбранные пользователи
              </Typography>
              <div class="select-block border">
                <div
                  class="unselected-selected-users shadow-sm rounded border"
                  v-for="(user, index) in unselectedUsers"
                  :key="index"
                  @click="selectUser(index)"
                >
                  <Typography class-name="m-2 fs-6">
                    {{ user.lastName }} {{ user.firstName }}
                  </Typography>
                </div>
              </div>
            </div>

            <div class="selectors">
              <Typography class-name="fs-6 text-primary">
                Выбранные пользователи
              </Typography>
              <div class="select-block border">
                <div
                  class="unselected-selected-users shadow-sm rounded border"
                  v-for="(user, index) in selectedUsers"
                  :key="index"
                  @click="unselectUser(index)"
                >
                  <Typography class-name="m-2 fs-6">
                    {{ user.lastName }} {{ user.firstName }}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            class-name="btn-primary w-100 mt-5 fs-6"
            @click="handleInviteFromPortal"
          >
            Пригласить
          </Button>
        </div>
        <div v-else>
          <div class="d-flex justify-content-between mt-4">
            <LoadingPlaceholder height="medium" />
            <LoadingPlaceholder height="medium" />
          </div>
          <div class="py-5">
            <LoadingPlaceholder height="small" />
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <FormInputs
            :fileds="fields"
            :submit-count="submitCount"
            v-model="fileInputRef"
            @push-email="push"
            @move-email="move"
            @remove-email="remove"
          />

          <div class="invite-modal__invite-button">
            <div class="invite-modal__form-controller mt-2">
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
                @click="fileInputRef?.click()"
              >
                Загрузить файл
              </Button>
            </div>

            <Button
              type="submit"
              class-name="btn-primary w-100 mt-2"
              @click="handleInviteFromOutside"
            >
              Пригласить
            </Button>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.invite-modal {
  min-width: 800px;
  max-width: 800px;
  min-height: 450px;
  max-height: 450px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  &__switch-buttons {
    @include flexible(stretch, center, $flex-wrap: wrap, $gap: 4px);
  }

  &__users {
    max-width: 400px;
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }

  &__delete-user {
    cursor: pointer;
  }

  &__invite-button {
    @include flexible(flex-end, center, $flex-wrap: wrap, $gap: 16px);
  }

  &__form-controller {
    @include flexible(center, center, $flex-wrap: wrap, $gap: 16px);
  }
}

.select-block {
  border-radius: 12px;
  height: 200px;
  overflow-y: hidden;
}

.unselected-selected-users {
  cursor: pointer;
  margin: 8px;
}
.unselected-selected-users:hover {
  background-color: rgb(240, 240, 240);
}

.selectors {
  width: 48%;
}
</style>
