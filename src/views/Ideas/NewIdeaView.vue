<script lang="ts" setup>
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="new-idea-page__content"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <IdeaForm title="Создание идеи" />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.new-idea-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
