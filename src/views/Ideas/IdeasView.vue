<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'

import SearchAndFilters from '@Views/Ideas/SearchAndFilters.vue'
import IdeasTable from '@Views/Ideas/IdeasTable.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import Button from '@Components/Button/Button.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()
const { ideas } = storeToRefs(ideaStore)

const ideasData = ref<Idea[]>([])

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const isLoading = ref(true)

const isOpenedfilter = ref(false)

const currrentFilters = [
  {
    category: 'Идеи',
    choices: ['Мои идеи', 'Идеи конкурентов', 'Идеи организации'],

    isUniqueChoice: false,
  },
  {
    category: 'Статус',
    choices: ['На рассмотрении', 'На согласовании', 'На утверждении'],

    isUniqueChoice: true,
  },
]

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await ideaStore.fetchIdeas(token)

    ideas.value.sort((a, b) => {
      if (a.rating == b.rating) {
        const A = new Date(a.createdAt).getTime()
        const B = new Date(b.createdAt).getTime()
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

const filters = [
  {
    label: 'Мои идеи',
    value: user.value?.email,
  },
  {
    label: 'На согласованнии',
    value: 'ON_APPROVAL',
  },
  {
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
          <!-- <div class="bg-primary rounded-3 d-flex p-2">
            <Button
              v-if="isOpenedfilter === false"
              class-name="bg-white "
              @click="isOpenedfilter = true"
              prepend-icon-name="bi bi-funnel"
              >фильтр</Button
            >

            <Button
              v-if="isOpenedfilter === true"
              class-name="bg-white"
              @click="isOpenedfilter = false"
              prepend-icon-name="bi bi-funnel"
              >фильтр</Button
            >
          </div> -->
        </div>

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
      </div>
      <FilterBar :filters="currrentFilters" />
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
