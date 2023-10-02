<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import SearchAndFilters from '@Views/IdeasView/SearchAndFilters.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Command from '@Domain/Command'

import CommandViewTable from './CommandViewTable.vue'

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const commandData = ref<Command[]>([])

onMounted(() => {
  const data = [
    {
      id: '0',
      name: 'А',
      dateCreation: new Date('2021-02-02'),
      members: ['Victor', 'Oleg', 'Sergey'],
      typeGroup: 'OPEN_TEAM',
      competencies: ['Java', 'JavaScript'],
    },
    {
      id: '1',
      name: 'Г',
      dateCreation: new Date('2021-02-01'),
      members: ['Victor', 'Oleg'],
      typeGroup: 'CLOSE_TEAM',
      competencies: ['SQL'],
    },
    {
      id: '2',
      name: 'Б',
      dateCreation: new Date('2021-02-05'),
      members: ['Victor'],
      typeGroup: 'CLOSE_TEAM',
      competencies: ['React', 'React Native'],
    },
    {
      id: '3',
      name: 'В',
      dateCreation: new Date('2021-02-07'),
      members: ['Victor', 'Sergey'],
      typeGroup: 'OPEN_TEAM',
      competencies: ['Django', 'Python'],
    },
  ]
  commandData.value = data
})

function filterCommand(team: Command[]) {
  if (selectedFilters.value.length) {
    const dataFilter: Command[] = []
    if (selectedFilters.value.includes('React')) {
      team?.forEach(
        (elem) =>
          selectedFilters.value?.every((filter) =>
            Object.values(elem.competencies).includes(filter),
          ) && dataFilter.push(elem),
      )
    } else {
      team?.forEach(
        (elem) =>
          selectedFilters.value?.every((filter) =>
            Object.values(elem).includes(filter),
          ) && dataFilter.push(elem),
      )
    }
    return dataFilter
  } else false
}

const filters = [
  {
    label: 'Открытые комадны',
    value: 'OPEN_TEAM',
  },
  {
    label: 'Закрытые команды',
    value: 'CLOSE_TEAM',
  },
  {
    label: 'React',
    value: 'React',
  },
  {
    label: 'Компетенции',
    valueDrop: ['React', 'React Native'],
  },
]
</script>
<template>
  <PageLayout content-class-name="command-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-75">Список команд</Typography>

      {{ selectedFilters }}
      <SearchAndFilters
        :filtersData="filters"
        v-model:searchedValue="searchedValue"
        v-model:selectedFilters="selectedFilters"
      />
      <CommandViewTable
        :command="filterCommand(commandData) || commandData"
        :searched-value="searchedValue"
      />
    </template>
  </PageLayout>
</template>
<style lang="scss">
.command-page {
  &__content {
    @include flexible(center, start, column, $gap: 12px);
  }
}
</style>
