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

import RequestTeamToIdea from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'
import getSkillsStyle from '@Utils/getSkillsStyle'
import RequestToIdeaService from '@Services/RequestToIdeaService'

const teams = defineModel<RequestTeamToIdea[]>('teams', { required: true })
const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref<boolean>(false)
const currentTeam = ref<RequestTeamToIdea>()

const requestsTableColumns: TableColumn<RequestTeamToIdea>[] = [
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

const dropdownIdeasActions: DropdownMenuAction<RequestTeamToIdea>[] = [
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

function isAcceptedFalse(team: RequestTeamToIdea) {
  return team.accepted === false
}

function isAcceptedTrue(team: RequestTeamToIdea) {
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

function navigateToTeamModal(team: RequestTeamToIdea) {
  return router.push(`/market/${route.params.id}/${team.id}`)
}

async function acceptRequestTeam(team: RequestTeamToIdea) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestToIdeaService.acceptRequestTeam(
      { ...team, accepted: true },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) => elem.id == team.id && (elem.accepted = true))
  }
}

async function rejectRequestTeam(team: RequestTeamToIdea) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestToIdeaService.acceptRequestTeam(
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

function openLetterTeam(team: RequestTeamToIdea) {
  isOpenedModal.value = true
  currentTeam.value = team
}

function closeLetterTeam() {
  isOpenedModal.value = false
}

const checkedIdeasMarketActions: CheckedDataAction<RequestTeamToIdea>[] = [
  {
    label: 'Принять заявки',
    className: 'btn-primary',
    click: acceptRequestTeams,
  },
]

function acceptRequestTeams(requestsTeams: RequestTeamToIdea[]) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = RequestToIdeaService.acceptRequestTeam(
      requestsTeams.filter((team) => (team.accepted = true)),
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) =>
      requestsTeams.forEach((team) => elem.id === team.id && (elem.accepted = true)),
    )
  }
}
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
