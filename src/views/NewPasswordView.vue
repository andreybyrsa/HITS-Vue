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
    password: (value: string) => Validation.checkPassword(value),
  },
})

const handleSendNewPassword = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <PageLayout content-class-name="new-password-page__content">
    <template #content>
      <FormLayout>
        <Typography class-name="fs-3 text-primary">Новый пароль</Typography>

        <Input
          type="password"
          name="password"
          placeholder="Введите пароль"
        >
          <template #prepend>
            <i class="bi bi-key"></i>
          </template>
        </Input>

        <Button
          type="submit"
          class-name="btn btn-primary w-100"
          @click="handleSendNewPassword"
        >
          Изменить пароль
        </Button>
      </FormLayout>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.new-password-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
