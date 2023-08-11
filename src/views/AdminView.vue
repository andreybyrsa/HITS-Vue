<script lang="ts" setup>
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="admin-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <router-view></router-view>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.admin-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
