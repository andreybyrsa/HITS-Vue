<script lang="ts" setup>
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="login-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <IdeaForm />
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
