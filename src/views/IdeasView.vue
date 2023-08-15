<script lang="ts" setup>
import Grid from '@Components/Ideas/Grid/Grid.vue'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Input from '@Components/Inputs/Input/Input.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/Modals/FilterModal/FilterModal.vue'
import useIdeasStore from '@Store/ideas/ideasStore'
import { Idea } from '@Domain/Idea'

// import Idea from '@Components/Ideas/Idea/Idea.vue'
const isOpenedFilter = ref(false)
const searchQuery = ref('')
const gridColumns = [
  'name',
  'status',
  'dateCreated',
  'dateModified',
  'rating',
  'risk',
]
const ideamegahuita = [
  {
    name: 'Вафли павшопвыашщ пш пшп вшщ впшощпм гмгмгк пкгшпшпвшпмк штощ',
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
const ideasStore = useIdeasStore()
const { initiatorIdeas } = storeToRefs(ideasStore)
const { ideas } = storeToRefs(ideasStore)

onMounted(async () => {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraXZhQG1haWwuY29tIiwiaWF0IjoxNjkyMTAxNDQ0LCJleHAiOjE2OTIxMDUwNDR9.Kq_Qef1TlmtwQIGspceLicHz1yqHVwV7XEVcnWln5vY'
  await ideasStore.fetchIdeas(token)
})

const selectedFilters = ref<string[]>([])

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Идеи</Typography>

      {{ ideas }}

      <div class="index-page__search bg-primary rounded-3 p-3 w-100">
        <Input
          name="asd"
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
      <Grid
        :data="ideamegahuita"
        :columns="gridColumns"
        :filter-key="searchQuery"
        class="demogrid w-100"
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
