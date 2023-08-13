<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RecoveryData } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const isOpenedModal = ref(false)

const response = reactive({
  key: '',
  error: '',
})

const { values, handleSubmit } = useForm<RecoveryData>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
})

function handleCloseModal() {
  isOpenedModal.value = false
}

const sendRevoveryEmail = handleSubmit(async (values) => {
  const { key, error } = await InvitationService.sendRecoveryEmail(values)

  if (key) {
    response.key = key
    isOpenedModal.value = true
  } else {
    response.error = error ?? 'Ошибка отправки почты'
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

        <Typography
          v-if="response.error"
          class-name="text-danger fs-6"
        >
          {{ response.error }}
        </Typography>

        <NewPasswordModal
          :is-opened="isOpenedModal"
          :email="values.email"
          :auth-key="response.key"
          @close-modal="handleCloseModal"
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
