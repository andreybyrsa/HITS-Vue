<template>
  <Table
    :data="requestToIdeaTeams"
    :columns="requestToIdeaColumns"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownRequestActions"
  />

  <LetterModal
    :letter="currentRequestToIdea?.letter"
    :is-opened="isOpenedLetterModal"
    @close-modal="closeLetterModal"
    @accept-request="acceptRequestToIdea(currentRequestToIdea)"
  />

  <ConfirmModal
    :is-opened="isOpenedAcceptModal"
    text-button="Принять заявку"
    text-question="Вы действительно хотите принять заявку?"
    @close-modal="closeAcceptModal"
    @action="acceptRequestToIdea(currentRequestToIdea)"
  />

  <ConfirmModal
    :is-opened="isOpenedCancelModal"
    text-button="Отклонить заявку"
    text-question="Вы действительно хотите отклонить заявку?"
    @close-modal="closeCancelModal"
    @action="cancelRequestToIdea(currentRequestToIdea)"
  />
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import RequestsToIdeaTableProps from '@Components/Tables/RequestsToIdeaTable/RequestsToIdeaTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'

import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'

import mutableSort from '@Utils/mutableSort'

const props = defineProps<RequestsToIdeaTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore()

const requestToIdeaTeams = ref<RequestTeamToIdea[]>([])
const currentRequestToIdea = ref<RequestTeamToIdea | null>(null)

const router = useRouter()

const isOpenedLetterModal = ref<boolean>(false)
const isOpenedAcceptModal = ref(false)
const isOpenedCancelModal = ref(false)

watchImmediate(
  () => props.requests,
  (requests) => {
    requestToIdeaTeams.value = requests
  },
)

const requestToIdeaColumns: TableColumn<RequestTeamToIdea>[] = [
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
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  // skills ?
]

const dropdownRequestActions: DropdownMenuAction<RequestTeamToIdea>[] = [
  {
    label: 'Профиль команды',
    click: navigateToTeamModal,
  },
  {
    label: 'Просмотреть письмо',
    click: (requestToIdea) => openModal(isOpenedLetterModal, requestToIdea),
  },
  {
    label: 'Принять',
    className: 'text-success',
    click: (requestToIdea) => openModal(isOpenedAcceptModal, requestToIdea),
  },
  {
    label: 'Отклонить',
    className: 'text-danger',
    click: (requestToIdea) => openModal(isOpenedCancelModal, requestToIdea),
  },
]

function getStatusFormat(status: RequestToIdeaStatus) {
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

function getStatusStyle(status: RequestToIdeaStatus) {
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

function sortByMembersCount() {
  mutableSort(
    requestToIdeaTeams.value,
    (requestsToIdea: RequestTeamToIdea) => requestsToIdea.membersCount,
  )
}

function navigateToTeamModal(requestTeam: RequestTeamToIdea) {
  const teamModalRoute: RouteRecordRaw = {
    name: 'teams',
    path: 'teams/:id',
    alias: '/teams/:id',
    component: TeamModal,
  }

  router.addRoute('market', teamModalRoute)
  router.push({ path: `/market/${requestTeam.teamId}` })
}

function openModal(refValue: Ref<boolean>, requestToIdea: RequestTeamToIdea) {
  currentRequestToIdea.value = requestToIdea
  refValue.value = true
}

function closeLetterModal() {
  currentRequestToIdea.value = null
  isOpenedLetterModal.value = false
}
function closeAcceptModal() {
  currentRequestToIdea.value = null
  isOpenedAcceptModal.value = false
}
function closeCancelModal() {
  currentRequestToIdea.value = null
  isOpenedCancelModal.value = false
}

async function acceptRequestToIdea(requestToIdea: RequestTeamToIdea | null) {
  const currentUser = user.value

  if (currentUser?.token && requestToIdea) {
    const { token } = currentUser

    await requestsToIdeaStore.acceptRequestToIdea(requestToIdea, token)
  }
}

async function cancelRequestToIdea(requestToIdea: RequestTeamToIdea | null) {
  const currentUser = user.value

  if (currentUser?.token && requestToIdea) {
    const { token } = currentUser

    await requestsToIdeaStore.cancelRequestToIdea(requestToIdea, token)
  }
}
</script>
