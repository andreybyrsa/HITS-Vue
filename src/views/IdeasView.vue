@@ -1,110 +1,155 @@
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Grid from '@Components/Ideas/Grid/Grid.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/Modals/FilterModal/FilterModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useIdeasStore from '@Store/ideas/ideasStore'
import useUserStore from '@Store/user/userStore'
import Table from '@Components/Table/Table.vue'
import { date } from 'yup'

const isOpenedFilter = ref(false)
const clickFunction = '1'
const searchValue = ref('')
const gridColumns = [
  { key: 'name', label: 'Название', click: () => console.log(clickFunction) },
  { key: 'status', label: 'Статус' },
  { key: 'dateCreated', label: 'Дата создания' },
  { key: 'dateModified', label: 'Дата изменения' },
  { key: 'rating', label: 'Рейтинг' },
]

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()
const { initiatorIdeas } = storeToRefs(ideasStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    // const { token } = currentUser
    const token = user.value?.token
    await ideasStore.fetchIdeas(token as string)
  }
})

const selectedFilters = ref<string[]>([])

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
      <Typography class-name="fs-2 text-primary w-100">Идеи</Typography>

      <div class="index-page__search bg-primary rounded-3 p-3 w-100">
        <Input
          name="asd"
          v-model="searchValue"
          placeholder="Поиск идей по названию"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </Input>

        <Button
          class-name="btn-light"
          @click="isOpenedFilter = true"
          ><i class="bi bi-funnel-fill"></i>Фильтр</Button
        >
        <FilterModal
          :is-opened="isOpenedFilter"
          @close-modal="handleCloseModal"
          :current-filters="[...selectedFilters]"
        />
      </div>

      <Table
        :columns="gridColumns"
        :data="ideamegahuita"
        :search-value="searchValue"
        :filter-value="gridColumns[0].key"
      >
        <template #actions="{ item }">
          <div>
            <Button
              class-name=" btn-primary text-white  fs-3  "
              prepend-icon-name="bi bi-list"
              >{{ item.number }}</Button
            >
          </div>
        </template>
      </Table>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.index-page__search {
  @include flexible(stretch, space-between, $gap: 16px);
}
</style>
