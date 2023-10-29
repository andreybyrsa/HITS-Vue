<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
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
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.getTeams(token)

    if (response instanceof Error) {
      return
    }

    commandData.value = response
  }
})

watch(
  () => searchedValue.value,
  (newVal) => {
    if (newVal) {
      selectedFilters.value.push(newVal)
    }
  },
)

function filterCommand(team: Team[]) {
  if (selectedFilters.value.length || searchedValue.value) {
    const dataFilter: Team[] = []
    team?.forEach((elem) => {
      const filters = [...selectedFilters.value]
      if (searchedValue.value) filters.push(searchedValue.value)
      const matchesAllFilters = filters.every(
        (filter) =>
          Object.values(elem)
            .map(String)
            .some((value) => value.toLowerCase() === filter.toLowerCase()) ||
          elem.skills
            .map((competence) => competence.toLowerCase())
            .includes(filter.toLowerCase()),
      )
      if (matchesAllFilters) {
        dataFilter.push(elem)
      }
    })
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
    label: 'Компетенции',
    valueDrop: [],
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
