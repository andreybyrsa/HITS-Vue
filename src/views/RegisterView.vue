<script lang="ts" setup>
import RegisterForm from '@Components/Forms/RegisterForm/RegisterForm.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="register-page__content">
    <template #content>
      <RegisterForm />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.register-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
