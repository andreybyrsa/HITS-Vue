<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import {
  TableColumn,
  CheckedDataAction,
  DropdownMenuAction,
} from '@Components/Table/Table.types'

import Table from '@Components/Table/Table.vue'
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'

import useUserStore from '@Store/user/userStore'

import RequestTeams from '@Domain/RequestTeams'
import { Skill } from '@Domain/Skill'
import getSkillsStyle from '@Utils/getSkillsStyle'

const teams = defineModel<RequestTeams[]>({ required: true })

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function filterTeamsAccepted(teams: RequestTeams[]) {
  return teams.filter((elem) => elem.accepted === false)
}

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
    label: 'Профиль команды',
    click: navigateToTeamModal,
  },
  {
    label: 'Просмотреть письмо',
    click: openLetterTeam,
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
  team.accepted = true
  teams.value.forEach((teamValue) =>
    teamValue.id == team.id ? (teamValue.accepted = true) : null,
  )
}

const isOpenedModal = ref<boolean>(false)
const currentTeam = ref<RequestTeams>()
function openLetterTeam(team: RequestTeams) {
  isOpenedModal.value = true
  currentTeam.value = team
}

function closeLetterTeam() {
  isOpenedModal.value = false
}
</script>

<template>
  <Table
    :columns="requestsTableColumns"
    :data="filterTeamsAccepted(teams)"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownIdeasActions"
  />
  <LetterModal
    v-if="currentTeam"
    :letter="currentTeam.letter"
    :is-opened="isOpenedModal"
    @close-modal="closeLetterTeam"
    @accept-request="acceptRequestTeam(currentTeam)"
  />
</template>
