<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RecoveryData } from '@Domain/Invitation'

import useNotification from '@Hooks/useNotification'
import useTimer from '@Hooks/useTimer'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const isOpenedModal = ref(false)

const authKey = ref('')
let expiredTime: Ref<string>

const {
  notificationOptions,
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

const sendRevoveryEmail = handleSubmit(async (values) => {
  const response = await InvitationService.sendRecoveryEmail(values)

  if (response instanceof Error) {
    return handleOpenNotification('error', response.message)
  }

  authKey.value = response
  isOpenedModal.value = true

  expiredTime = useTimer(300)

  handleOpenNotification('success')
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
          class-name="rounded-end"
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
          :type="notificationOptions.type"
          :is-opened="isOpenedNotification"
          @close-modal="handleCloseNotification"
        >
          {{
            notificationOptions.type === 'success'
              ? `Код отправлен на почту ${values.email}. Время действия кода ${expiredTime}`
              : notificationOptions.message
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
