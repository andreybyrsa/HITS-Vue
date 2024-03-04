<script lang="ts" setup>
import LoginForm from '@Components/Forms/LoginForm/LoginForm.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="login-page__content p-3">
    <template #content>
      <LoginForm />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.login-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
