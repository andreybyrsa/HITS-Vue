<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import SearchAndFilters from '@Views/IdeasView/SearchAndFilters.vue'
import IdeasTable from '@Views/IdeasView/IdeasTable.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

// import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()
const { ideas } = storeToRefs(ideaStore)

const ideasData = ref<Idea[]>([])

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const isLoading = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await ideaStore.fetchIdeas(token)

    if (ideas instanceof Error) {
      return
    }

    ideas.value.sort((a, b) => {
      if (a.rating == b.rating) {
        const A = new Date(a.dateCreated).getTime()
        const B = new Date(b.dateCreated).getTime()
        return A - B
      } else return b.rating - a.rating
    })

    ideasData.value = ideas.value

    isLoading.value = false
  }
})

watchImmediate(
  () => user.value?.role,
  () => {
    switch (user.value?.role) {
      case 'EXPERT':
        return (selectedFilters.value = ['ON_CONFIRMATION'])
      case 'PROJECT_OFFICE':
        return (selectedFilters.value = ['ON_APPROVAL'])
      case 'INITIATOR':
        return (selectedFilters.value = [user.value.email])
      default:
        selectedFilters.value = []
    }
  },
)

function filterIdeas(ideasData: Idea[]) {
  if (selectedFilters.value.length) {
    const dataFilter: Idea[] = []
    ideasData?.forEach(
      (elem) =>
        selectedFilters.value?.every((filter) =>
          Object.values(elem).includes(filter),
        ) && dataFilter.push(elem),
    )
    return dataFilter
  } else false
}
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
        :ideas="filterIdeas(ideasData) || ideasData"
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
