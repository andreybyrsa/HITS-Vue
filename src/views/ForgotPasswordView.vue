<script lang="ts" setup>
import { reactive } from 'vue'
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import ResponseMessage from '@Domain/ResponseMessage'
import { RecoveryData } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const response = reactive<ResponseMessage>({
  success: '',
  error: '',
})

const { handleSubmit } = useForm<RecoveryData>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
})

const sendRevoveryEmail = handleSubmit(async (values) => {
  try {
    const { success, error } = await InvitationService.sendRecoveryEmail(values)

    if (success) {
      response.success = success
    } else {
      response.error = error
    }
  } catch {
    response.error = 'Ошибка отправки почты'
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
          v-if="response.success || response.error"
          :class-name="
            response.success ? 'text-success fs-6' : 'text-danger fs-6'
          "
        >
          {{ response.success || response.error }}
        </Typography>
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
