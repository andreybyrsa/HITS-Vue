<template>
  <Table
    :data="teams"
    :columns="requestToIdeaColumns"
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

  <ConfirmModal
    :is-opened="isOpenedConfirmModalAccepted"
    text-button="Принять заявку"
    text-question="Вы действительно хотите принять заявку?"
    @close-modal="closeConfirmModal"
    @action="acceptRequestToIdea"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModalCancel"
    text-button="Отклонить заявку"
    text-question="Вы действительно хотите отклонить заявку?"
    @close-modal="closeConfirmModal"
    @action="cancelRequestToIdea"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import {
  RequestsToIdeaProps,
  ReviewIdeaRequestsFormProps,
} from './ReviewIdeaRequestsForm.types'
import {
  TableColumn,
  DropdownMenuAction,
  CheckedDataAction,
} from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

import { RequestTeams, RequestsToIdeaStatus } from '@Domain/RequestTeamToIdea'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore' //  НУЖЕН НОВЫЙ СТОР ДЛЯ МАРКЕТА (ЗАМЕНИТЬ КОГДА АНДРЕЙ ЗАПУШИТ)
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'
import RequestToIdeaService from '@Services/RequestToIdeaService'
const teams = defineModel<RequestTeams[]>('teams', { required: true })
const skillsRequestTeam = defineModel<RequestTeams[]>('skillsRequestTeam')

const props = defineProps<ReviewIdeaRequestsFormProps>()

const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore() //  НУЖЕН НОВЫЙ СТОР ДЛЯ МАРКЕТА (ЗАМЕНИТЬ КОГДА АНДРЕЙ ЗАПУШИТ)

const router = useRouter()

const isOpenedModal = ref<boolean>(false)
const currentTeam = ref<RequestTeams>()

const requestToIdeaColumns: TableColumn<RequestTeams>[] = [
  {
    key: 'status',
    label: 'Статус',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getStatusStyle,
  },
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
    rowCellClick: navigateToTeamProfile,
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
  {
    label: 'Отклонить',
    className: 'text-danger',
    click: rejectRequestTeam,
  },
]

function getStatusFormat(status: RequestsToIdeaStatus) {
  if (status === 'NEW') {
    return 'Новая'
  }

  if (status === 'ACCEPTED') {
    return 'Принята'
  }

  if (status === 'CANCELLED') {
    return 'Отклонена'
  }
}

function getStatusStyle(status: RequestsToIdeaStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ACCEPTED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'CANCELLED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
}

function navigateToTeamProfile(request: RequestTeams) {
  const profileRoute: RouteRecordRaw = {
    name: 'teams',
    path: 'teams/:id',
    alias: '/teams/:id',
    component: TeamModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('teams-list', profileRoute)
  router.push({ path: `/teams/${request.teamId}` })
}

function navigateToTeamModal(team: RequestTeams) {
  return router.push(`/market/${route.params.id}/${team.id}`)
}

const isOpenedConfirmModalAccepted = ref(false)
const isOpenedConfirmModalCancel = ref(false)
const requestToIdea = ref<RequestTeams>()

function closeConfirmModal() {
  requestToIdea.value = undefined
  isOpenedConfirmModalAccepted.value = false
  isOpenedConfirmModalCancel.value = false
}

async function acceptRequestTeam(team: RequestTeams) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestToIdeaService.acceptRequestTeam(
      { ...team, status: 'ACCEPTED' },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) => elem.id == team.id && (elem.status = 'CANCELLED'))
  }
}

async function rejectRequestTeam(team: RequestTeams) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestToIdeaService.acceptRequestTeam(
      { ...team, status: 'CANCELLED' },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) =>
      elem.id == team.id ? (elem.status = 'CANCELLED') : null,
    )
  }
}

async function acceptRequestToIdea() {
  const currentUser = user.value

  if (currentUser?.token && requestToIdea.value) {
    const { id } = props.idea
    const { token } = currentUser

    await requestsToIdeaStore.getRequestsToIdea(id, token) // store

    requestToIdea.value = undefined
    isOpenedConfirmModalAccepted.value = false
  }
}

async function cancelRequestToIdea() {
  const currentUser = user.value

  if (currentUser?.token && requestToIdea.value) {
    const { token } = currentUser
    const { id } = props.idea

    await requestsToIdeaStore.getRequestsToIdea(id, token) // store

    requestToIdea.value = undefined
    isOpenedConfirmModalCancel.value = false
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
    click: acceptRequestTeams,
  },
]

function acceptRequestTeams(requestsTeams: RequestTeams[]) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = RequestToIdeaService.acceptRequestTeam(
      {
        ...requestsTeams,
        status: 'ACCEPTED',
        ideaId: '',
        letter: '',
        teamId: '',
        id: '',
        name: '',
        membersCount: 0,
        skills: [],
      },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.forEach((elem) =>
      requestsTeams.forEach(
        (team) => elem.id === team.id && (elem.status = 'ACCEPTED'),
      ),
    )
  }
}
</script>
