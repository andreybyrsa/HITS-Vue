<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import IdeaCards from './IdeaCards.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>
<template>
  <PageLayout content-class-name="command-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <Typography class-name="fs-2 text-primary w-75">Биржа идей</Typography>

      <IdeaCards></IdeaCards>
    </template>
  </PageLayout>
</template>
