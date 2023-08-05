<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import AuthService from '@Services/AuthService'

const email = ref('')

const sendEmail = () => {
  AuthService.sendRecoveryEmail(email.value)
}
</script>

<template>
  <PageLayout content-class-name="forgot-password-page__content">
    <template #content>
      <div class="forgot-password-form p-3 rounded-3 shadow">
        <Typography class-name="fs-3 text-primary">
          Востановление пароля
        </Typography>

        <Input
          v-model:value="email"
          placeholder="Введите email"
          prepend="@"
        />

        <Button
          class-name="btn-primary w-100"
          @click="sendEmail"
        >
          Отправить
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.forgot-password-page {
  &__content {
    @include flexible(center, center);
  }
}

.forgot-password-form {
  width: 400px;

  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
