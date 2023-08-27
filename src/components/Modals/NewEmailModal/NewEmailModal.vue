<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import useNotification from '@Hooks/useNotification'
import useTimer from '@Hooks/useTimer'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'
import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const route = useRoute()
const { slug } = route.params

let expiredTime: Ref<string>
const isOpenedCodeModal = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { setFieldValue, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    oldEmail: (value: string) => Validation.checkEmail(value),
    code: (value: string) => value?.length === 6 || 'Неверно введен код',
    newEmail: (value: string) => Validation.checkEmail(value),
    url: (value: string) => value?.length,
  },
  initialValues: { url: slug },
})

onMounted(async () => {
  const { slug } = route.params
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await InvitationService.getInfoToChangeEmail(slug, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    const { newEmail, oldEmail } = response
    isOpenedCodeModal.value = true
    expiredTime = useTimer(300)

    setFieldValue('newEmail', newEmail)
    setFieldValue('oldEmail', oldEmail)
  }
})

const handleChangeEmail = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.updateUserEmail(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    userStore.removeUser()
  }
})

function handleCloseCodeModal() {
  isOpenedCodeModal.value = false
}
</script>

<template>
  <ModalLayout :is-opened="true">
    <div
      v-if="true"
      class="new-email-modal p-3 rounded"
    >
      <Typography class-name="fs-3 text-primary">Новая почта</Typography>

      <Input
        type="text"
        name="code"
        class-name="rounded-end"
        placeholder="Введите код аутентификации"
      >
        <template #prepend>
          <i class="bi bi-shield-check"></i>
        </template>
      </Input>

      <Button
        class-name="btn-primary w-100"
        @click="handleChangeEmail"
      >
        Подтвердить
      </Button>
    </div>

    <NotificationModal
      type="success"
      :is-opened="isOpenedCodeModal"
      @close-modal="handleCloseCodeModal"
    >
      Код отправлен на старую почту, время действия кода: {{ expiredTime }}
    </NotificationModal>

    <NotificationModal
      :type="notificationOptions.type"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
      :time-expired="5000"
    >
      {{ notificationOptions.message }}
    </NotificationModal>
  </ModalLayout>
</template>

<style lang="scss">
.new-email-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    center,
    flex-start,
    column,
    $gap: 12px,
    $align-self: center,
    $justify-self: center
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .new-email-modal,
.modal-layout-leave-to .new-email-modal {
  transform: scale(0.9);
}
</style>
