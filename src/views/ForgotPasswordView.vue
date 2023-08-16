<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RecoveryData } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'
import useNotification from '@Utils/useNotification'

const isOpenedModal = ref(false)

const authKey = ref('')
const expiredTime = ref('')

const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { values, handleSubmit } = useForm<RecoveryData>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
})

function startTimer() {
  let initialSeconds = 300

  const intervalID = setInterval(() => {
    const minutes = Math.floor(initialSeconds / 60)
    const seconds = initialSeconds - minutes * 60

    const currentMinutes =
      minutes.toString().length > 1 ? minutes : `0${minutes}`
    const currentSeconds =
      seconds.toString().length > 1 ? seconds : `0${seconds}`

    expiredTime.value = `${currentMinutes}:${currentSeconds}`

    if (initialSeconds > 0) {
      initialSeconds--
    } else {
      clearInterval(intervalID)
    }
  }, 1000)
}

const sendRevoveryEmail = handleSubmit(async (values) => {
  const { key, error } = await InvitationService.sendRecoveryEmail(values)

  if (key) {
    authKey.value = key
    isOpenedModal.value = true

    startTimer()

    handleOpenNotification('success')
  } else {
    const currentError = error ?? 'Ошибка отправки почты'
    handleOpenNotification('error', currentError)
  }
})
</script>

<template>
  <PageLayout content-class-name="forgot-password-page__content">
    <template #content>
      <FormLayout class-name="text-center">
        <Typography class-name="fs-3 text-primary">
          Востановление пароля
        </Typography>

        <Input
          type="email"
          name="email"
          placeholder="Введите email"
          prepend="@"
        />

        <Button
          type="submit"
          class-name="btn-primary w-100"
          @click="sendRevoveryEmail"
        >
          Отправить
        </Button>

        <NotificationModal
          :type="responseMessage.type"
          :is-opened="isOpenedNotification"
          @close-modal="handleCloseNotification"
        >
          {{
            responseMessage.type === 'success'
              ? `Код отправлен на почту ${values.email}. Время действия кода ${expiredTime}`
              : responseMessage.message
          }}
        </NotificationModal>

        <NewPasswordModal
          :is-opened="isOpenedModal"
          :email="values.email"
          :auth-key="authKey"
        />
      </FormLayout>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.forgot-password-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
