<script lang="ts" setup>
import { ref } from 'vue'
import Typography from '@Components/Typography/Typography.vue'
import IdeaCards from './IdeaCards.vue'
import SearchAndFilters from '@Views/Ideas/SearchAndFilters.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
const searchedValue = ref('')
const filters = [{}]
const selectedFilters = ref<string[]>([])
</script>
<template>
  <PageLayout content-class-name="command-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <Typography class-name="fs-2 text-primary w-75">Биржа идей</Typography>
      <SearchAndFilters
        :filtersData="filters"
        v-model:searchedValue="searchedValue"
        v-model:selectedFilters="selectedFilters"
      />
      <IdeaCards></IdeaCards>
    </template>
  </PageLayout>
</template>
