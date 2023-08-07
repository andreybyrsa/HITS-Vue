<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

const email = ref('')
</script>

<template>
  <PageLayout content-class-name="forgot-password-page__content">
    <template #content>
      <FormLayout>
        <Typography class-name="fs-3 text-primary">
          Востановление пароля
        </Typography>

        <Input
          v-model="email"
          placeholder="Введите email"
          prepend="@"
        />

        <Button class-name="btn-primary w-100"> Отправить </Button>
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
