<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  CheckedDataAction,
  DropdownMenuAction,
} from '@Components/Table/Table.types'

import useUserStore from '@Store/user/userStore'

import RequestTeams from '@Domain/RequestTeams'
import { Skill } from '@Domain/Skill'
import getSkillsStyle from '@Utils/getSkillsStyle'

const teams = defineModel<RequestTeams[]>({ required: true })

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsData = ref<RequestTeams[]>([])

function filterTeamsAccepted(teams: RequestTeams[]) {
  return teams.filter((elem) => elem.accepted === false)
}

watchImmediate(
  () => teams.value,
  () => {
    teamsData.value = filterTeamsAccepted(teams.value)
  },
)

const requestsTableColumns: TableColumn<RequestTeams>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'membersCount',
    label: 'Число участников',
    contentClassName: 'justify-content-center',
  },
  {
    key: 'skills',
    label: 'Компетенции',
    size: 'col-4',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFilterSkills,
    getRowCellStyle: getSkillsStyle,
  },
]

const dropdownIdeasActions: DropdownMenuAction<RequestTeams>[] = [
  {
    label: 'Просмотреть',
    click: navigateToTeamModal,
  },
  {
    label: 'Принять',
    className: 'text-success',
    click: acceptRequestTeam,
  },
]

function getFilterSkills(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  return currentSkill.name
}

function navigateToTeamModal(team: RequestTeams) {
  // router.push(`/ideas/list/${idea.id}`)
}

function acceptRequestTeam(team: RequestTeams) {
  // router.push(`/ideas/list/${idea.id}`)
}
</script>

<template>
  <Table
    :columns="requestsTableColumns"
    :data="teamsData"
    search-by="name"
    :dropdown-actions-menu="dropdownIdeasActions"
  />
</template>
