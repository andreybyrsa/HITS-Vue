<template>
  <PageLayout content-class-name="add-users-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <AddUsersForm />

      <router-view />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<style lang="scss">
.add-users-page {
  &__content {
    overflow-y: scroll;

    @include flexible(center, center);
  }
}
</style>
