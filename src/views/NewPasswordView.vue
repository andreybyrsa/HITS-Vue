<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import AuthService from '@Services/AuthService'

const newPassword = ref('')

const sendPassword = () => {
  AuthService.sendNewPassword(newPassword.value)
}
</script>

<template>
  <PageLayout content-class-name="new-password-page__content">
    <template #content>
      <div class="new-password-form p-3 rounded-3 shadow">
        <Typography class-name="fs-3 text-primary"> Новый пароль </Typography>

        <Input
          type="password"
          v-model:value="newPassword"
          placeholder="Введите пароль"
        >
          <template #prepend>
            <i class="bi bi-key"></i>
          </template>
        </Input>

        <Button
          class-name="btn btn-primary w-100"
          @click="sendPassword"
        >
          Изменить пароль
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.new-password-page {
  &__content {
    @include flexible(center, center);
  }
}

.new-password-form {
  width: 400px;

  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
