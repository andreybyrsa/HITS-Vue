<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

const newPassword = ref('')
</script>

<template>
  <PageLayout content-class-name="new-password-page__content">
    <template #content>
      <FormLayout>
        <Typography class-name="fs-3 text-primary"> Новый пароль </Typography>

        <Input
          type="password"
          v-model="newPassword"
          placeholder="Введите пароль"
        >
          <template #prepend>
            <i class="bi bi-key"></i>
          </template>
        </Input>

        <Button class-name="btn btn-primary w-100"> Изменить пароль </Button>
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
