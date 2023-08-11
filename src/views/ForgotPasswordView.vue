<script lang="ts" setup>
import { useForm } from 'vee-validate'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import Validation from '@Utils/Validation'

const { handleSubmit } = useForm({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
})

const sendRevoveryEmail = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <PageLayout content-class-name="forgot-password-page__content">
    <template #content>
      <FormLayout>
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
