<script lang="ts" setup>
import Grid from '@Components/Ideas/Grid/Grid.vue'
import { ref } from 'vue'
import Input from '@Components/Inputs/Input/Input.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/FilterModal/FilterModal.vue'
import Idea from '@Components/Ideas/Idea/Idea.vue'
const isOpenedFilter = ref(false)
const searchQuery = ref('')
const gridColumns = [
  'name',
  'status',
  'creationDate',
  'updatedDate',
  'rating',
  'risk',
]

const selectedFilters = ref<string[]>([])

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}

const gridData = [
  {
    name: 'Беспроводные зарядки на партах',
    status: 'На согласовании',
    creationDate: new Date('2022-01-10'),
    updatedDate: new Date('2022-01-15'),
    rating: 4.5,
    risk: 2.7,
  },
  {
    name: 'Кондиционеры в кабинетах',
    status: 'На согласовании',
    creationDate: new Date('2021-01-10'),
    updatedDate: new Date('2021-01-15'),
    rating: 3.4,
    risk: 3.9,
  },
  {
    name: 'Свежая булочная на 5ом этаже ВШЦТ',
    status: 'На согласовании',
    creationDate: new Date('2019-10-20'),
    updatedDate: new Date('2020-01-15'),
    rating: 4.9,
    risk: 3.9,
  },
  {
    name: 'Макбуки',
    status: 'На согласовании',
    creationDate: new Date('2023-01-10'),
    updatedDate: new Date('2019-01-15'),
    rating: 5,
    risk: 4,
  },
]
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <div class="grid-container"></div>
    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Идеи</Typography>

      <div class="index-page__search bg-primary rounded-3 p-3 w-100">
        <Input
          v-model="searchQuery"
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
      <div>{{ selectedFilters }}</div>
      <Grid
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery"
        class="demogrid"
        style="min-width: 100%"
      >
      </Grid>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(center, start, column, $gap: 16px);
  }
}

.index-page__search {
  @include flexible(stretch, space-between, $gap: 16px);
}
</style>
