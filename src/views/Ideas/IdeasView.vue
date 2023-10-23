<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import Filter from '@Components/Modals/FilterModal/Filter.types'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import SearchAndFilters from '@Views/Ideas/SearchAndFilters.vue'
import IdeasTable from '@Views/Ideas/IdeasTable.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideas = ref<Idea[]>()

const searchedValue = ref('')
const selectedFilters = ref<Filter<Idea>[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await IdeasService.getIdeas(token)

    if (response instanceof Error) {
      return // notification
    }

    response.sort((a, b) => {
      if (a.rating == b.rating) {
        const A = new Date(a.createdAt).getTime()
        const B = new Date(b.createdAt).getTime()
        return A - B
      } else if (a.rating && b.rating) {
        return b.rating - a.rating
      }
      return 0
    })

    ideas.value = response
  }
})

watchImmediate(
  () => user.value?.role,
  () => {
    switch (user.value?.role) {
      case 'EXPERT':
        return (selectedFilters.value = [
          {
            id: 2,
            key: 'status',
            label: 'На утверждении',
            value: 'ON_CONFIRMATION',
          },
        ])
      case 'PROJECT_OFFICE':
        return (selectedFilters.value = [
          {
            id: 1,
            key: 'status',
            label: 'На согласованнии',
            value: 'ON_APPROVAL',
          },
        ])
      case 'INITIATOR':
        return (selectedFilters.value = [
          {
            id: 0,
            key: 'initiator',
            label: 'Мои идеи',
            value: `${user.value?.id}`,
          },
        ])
      default:
        selectedFilters.value = []
    }
  },
)

const filteredIdeas = computed(() => {
  if (selectedFilters.value.length) {
    return ideas.value?.filter((idea) => {
      const isMathedFilters = selectedFilters.value.every(
        (filter) => idea[filter.key] === filter.value,
      )

      return isMathedFilters
    })
  }

  return ideas.value
})

const filters = [
  {
    id: 0,
    key: 'initiator',
    label: 'Мои идеи',
    value: `${user.value?.id}`,
  },
  {
    id: 1,
    key: 'status',
    label: 'На согласованнии',
    value: 'ON_APPROVAL',
  },
  {
    id: 2,
    key: 'status',
    label: 'На утверждении',
    value: 'ON_CONFIRMATION',
  },
]
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="ideas-page__table-and-filter w-100">
        <router-view></router-view>

        <Typography class-name="fs-2 text-primary w-75">Список идей</Typography>

        <div class="w-100 d-flex justify-content-center">
          <SearchAndFilters
            :filtersData="filters"
            v-model:searchedValue="searchedValue"
            v-model:selectedFilters="selectedFilters"
          />
        </div>

        <IdeasTable
          v-if="filteredIdeas"
          :ideas="filteredIdeas"
          :searched-value="searchedValue"
        />
        <LoadingPlaceholder
          v-else
          v-for="value in 3"
          :key="value"
          height="medium"
        />
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(start, start);
  }
  &__table-and-filter {
    @include flexible(center, start, column, $gap: 12px);
  }
}
</style>
