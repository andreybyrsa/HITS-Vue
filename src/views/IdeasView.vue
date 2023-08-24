<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Input from '@Components/Inputs/Input/Input.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/Modals/FilterModal/FilterModal.vue'
import Table from '@Components/Table/Table.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useIdeasStore from '@Store/ideas/ideasStore'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()
const { ideas } = storeToRefs(ideasStore)

const isOpenedFilter = ref(false)

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const gridColumns = [
  { key: 'name', label: 'Название', click: () => console.log(1) },
  { key: 'status', label: 'Статус' },
  { key: 'dateCreated', label: 'Дата создания' },
  { key: 'dateModified', label: 'Дата изменения' },
  { key: 'rating', label: 'Рейтинг' },
]

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await ideasStore.fetchIdeas(token)
  }
})

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}

const ideamegahuita = [
  {
    name: 'Тортики Тортики Тортики Тортики Тортики Тортики ',
    dateCreated: '2023-01-10',
    dateModified: '2023-01-10',
    projectType: 'INSIDE',
    problem: 'проблема',
    solution: 'еще что то',
    result: 'результат',
    customer: 'Газпром',
    description: 'описание вроде',
    risk: 0.5,
    rating: 1,
    status: 'ON_EDITING',
  },
  {
    name: 'Печеньки',
    dateCreated: '2024-01-10',
    dateModified: '2024-01-10',
    projectType: 'INSIDE',
    problem: 'проблема',
    solution: 'еще что то',
    result: 'результат',
    customer: 'Газпром',
    description: 'описание вроде',
    risk: 0.5,
    rating: 1,
    status: 'ON_EDITING',
  },
  {
    name: 'Пряники',
    dateCreated: '2022-01-10',
    dateModified: '2022-01-10',
    projectType: 'INSIDE',
    problem: 'проблема',
    solution: 'еще что то',
    result: 'результат',
    customer: 'Газпром',
    description: 'описание вроде',
    risk: 0.5,
    rating: 2,
    status: 'ON_EDITING',
  },
]
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Список идей</Typography>

      <div class="ideas-page__search bg-primary rounded-3 p-2 w-100">
        <Input
          name="search-input"
          class-name="rounded-end"
          v-model="searchedValue"
          placeholder="Поиск идей по названию"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </Input>

        <Button
          class-name="btn-light"
          prepend-icon-name="bi bi-funnel"
          @click="isOpenedFilter = true"
        >
          Фильтр
        </Button>
        <FilterModal
          :is-opened="isOpenedFilter"
          @close-modal="handleCloseModal"
          :current-filters="[...selectedFilters]"
        />
      </div>

      <Table
        :columns="gridColumns"
        :data="ideas"
        :search-value="searchedValue"
      >
        <template #actions="{ item }">
          <div>
            <Button
              class-name=" btn-primary text-white  fs-3  "
              prepend-icon-name="bi bi-list"
            >
              {{ item.number }}
            </Button>
          </div>
        </template>
      </Table>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(center, start, column, $gap: 12px);
  }

  &__search {
    @include flexible(stretch, space-between, $gap: 8px);
  }
}
</style>
