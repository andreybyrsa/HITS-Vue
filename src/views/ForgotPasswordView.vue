<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RecoveryData } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const isOpenedModal = ref(false)

const authKey = ref('')

const notificationsStore = useNotificationsStore()

const { values, handleSubmit } = useForm<RecoveryData>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
})

const sendRevoveryEmail = handleSubmit(async (values) => {
  const response = await InvitationService.sendRecoveryEmail(values)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  authKey.value = response
  isOpenedModal.value = true

  notificationsStore.createSystemNotification(
    'Система',
    'На почту отправлен код аутентификации',
  )
})
</script>

<template>
  <PageLayout content-class-name="forgot-password-page__content">
    <template #content>
      <FormLayout>
        <Typography class-name="fs-3 text-primary text-center">
          Восстановление пароля
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
          variant="primary"
          @click="sendRevoveryEmail"
        >
          Отправить
        </Button>

        <NewPasswordModal :is-opened="isOpenedModal" />
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
