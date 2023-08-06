<script lang="ts" setup>
import LoginForm from '@Components/Forms/LoginForm/LoginForm.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

setTimeout(() => userStore.checkLastActivity(), 1000)
</script>

<template>
  <PageLayout content-class-name="login-page__content">
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
