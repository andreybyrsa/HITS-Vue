<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import {
  TableColumn,
  DropdownMenuAction,
  CheckedDataAction,
} from '@Components/Table/Table.types'

import Table from '@Components/Table/Table.vue'
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'

import useUserStore from '@Store/user/userStore'

import RequestTeams from '@Domain/RequestTeams'
import { Skill } from '@Domain/Skill'
import getSkillsStyle from '@Utils/getSkillsStyle'
import RequestTeamsServise from '@Services/RequestTeamsServise'

const teams = defineModel<RequestTeams[]>('teams', { required: true })
const skillsRequestTeam = defineModel<RequestTeams[]>('skillsRequestTeam')

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref<boolean>(false)
const currentTeam = ref<RequestTeams>()

const requestsTableColumns: TableColumn<RequestTeams>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'accepted',
    label: 'Статус',
    contentClassName: 'justify-content-center',
    getRowCellFormat: getAcceptedTeams,
    getRowCellStyle: getStatusStyle,
  },
  {
    key: 'membersCount',
    label: 'Число участники',
    contentClassName: 'justify-content-center',
  },
  {
    key: 'skills',
    label: 'Компетенции',
    size: 'col-3',
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
    statement: isAcceptedFalse,
  },
  {
    label: 'Отклонить',
    className: 'text-danger',
    click: rejectRequestTeam,
    statement: isAcceptedTrue,
  },
]

function isAcceptedFalse(team: RequestTeams) {
  return team.accepted === false
}

function isAcceptedTrue(team: RequestTeams) {
  return team.accepted === true
}

function getStatusStyle(accepted: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (accepted) {
    initialClass.push('bg-success-subtle', 'text-success')

    return initialClass
  }
  initialClass.push('bg-danger-subtle', 'text-danger')
  return initialClass
}

function getAcceptedTeams(accepted: boolean) {
  if (accepted) {
    return 'Принята'
  }
  return 'На рассмотрении'
}

function getFilterSkills(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  return currentSkill.name
}

function navigateToTeamModal(team: RequestTeams) {
  return router.push(`/market/${route.params.id}/${team.id}`)
}

async function acceptRequestTeam(team: RequestTeams) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestTeamsServise.putRequestTeam(
      { ...team, accepted: true },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) =>
      elem.id == team.id ? (elem.accepted = true) : null,
    )
  }
}

async function rejectRequestTeam(team: RequestTeams) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestTeamsServise.putRequestTeam(
      { ...team, accepted: false },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) =>
      elem.id == team.id ? (elem.accepted = false) : null,
    )
  }
}

function openLetterTeam(team: RequestTeams) {
  isOpenedModal.value = true
  currentTeam.value = team
}

function closeLetterTeam() {
  isOpenedModal.value = false
}

const checkedIdeasMarketActions: CheckedDataAction<RequestTeams>[] = [
  {
    label: 'Принять заявки',
    className: 'btn-primary',
    click: () => null,
  },
]
</script>

<template>
  <router-view />
  <Table
    :columns="requestsTableColumns"
    :data="teams"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownIdeasActions"
    :checked-data-actions="checkedIdeasMarketActions"
    v-model="skillsRequestTeam"
  />
  <LetterModal
    v-if="currentTeam"
    :letter="currentTeam.letter"
    :is-opened="isOpenedModal"
    @close-modal="closeLetterTeam"
    @accept-request="acceptRequestTeam(currentTeam)"
  />
</template>
