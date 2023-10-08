<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import SearchAndFilters from '@Views/IdeasView/SearchAndFilters.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Command from '@Domain/Command'

import CommandViewTable from './CommandViewTable.vue'
import TeamService from '@Services/TeamService'
import useUserStore from '@Store/user/userStore'
import Team from '@Domain/Team'

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const commandData = ref<Team[]>([])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onMounted(async () => {
  const data = await TeamService.getTeams(user.value?.token as string)
  commandData.value = data
})

function filterCommand(team: Team[]) {
  if (selectedFilters.value.length) {
    const dataFilter: Team[] = []
    team?.forEach(
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
