<script lang="ts" setup>
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="add-users-page__content p-3 bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <AddUsersForm />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.add-users-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
