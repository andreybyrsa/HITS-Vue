<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import SearchAndFilters from '@Views/IdeasView/SearchAndFilters.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import IdeasService from '@Services/IdeasService'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import IdeasTable from './IdeasTable.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideas = ref<Idea[]>([])

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const isLoading = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await IdeasService.fetchIdeas(token)

    if (response instanceof Error) {
      return
    }

    ideas.value = response
    isLoading.value = false
  }
})
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-75">Список идей</Typography>

      <SearchAndFilters
        v-model:searchedValue="searchedValue"
        v-model:selectedFilters="selectedFilters"
      />

      <template v-if="isLoading">
        <LoadingPlaceholder
          v-for="value in 3"
          :key="value"
          height="medium"
        />
      </template>
      <IdeasTable
        v-else
        :ideas="ideas"
        :searched-value="searchedValue"
      />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(center, start, column, $gap: 12px);
  }
}
</style>
