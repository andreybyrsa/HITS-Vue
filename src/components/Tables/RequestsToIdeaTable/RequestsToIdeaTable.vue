<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="requestToIdeaTeams"
    :columns="requestToIdeaColumns"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownRequestActions"
    v-model="selectedRequest"
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
    text-question="Команду можно выбрать только один раз"
    @close-modal="closeAcceptModal"
    @action="acceptRequestToIdea(currentRequestToIdea)"
  />

  <ConfirmModal
    :is-opened="isOpenedCancelModal"
    text-button="Отклонить заявку"
    text-question="Эта команда больше не сможет подать заявку"
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

import { Skill } from '@Domain/Skill'
import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'

import mutableSort from '@Utils/mutableSort'
import { getSkillInfoStyle } from '@Utils/skillsInfo'
import { getJoinStatus, getJoinStatusStyle } from '@Utils/joinStatus'

const props = defineProps<RequestsToIdeaTableProps>()
const selectedTeam = defineModel<RequestTeamToIdea[]>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore()

const requestToIdeaTeams = ref<RequestTeamToIdea[]>([])
const currentRequestToIdea = ref<RequestTeamToIdea | null>(null)

const selectedRequest = ref<RequestTeamToIdea[]>([])

const router = useRouter()

const isOpenedLetterModal = ref<boolean>(false)
const isOpenedAcceptModal = ref(false)
const isOpenedCancelModal = ref(false)

const requestsToTeamStatus = getJoinStatus()

watchImmediate(
  () => props.requests,
  (requests) => {
    requestToIdeaTeams.value = requests
  },
)

watchImmediate(
  () => selectedRequest.value,
  () => {
    selectedTeam.value = selectedRequest.value
  },
)

const requestToIdeaColumns: TableColumn<RequestTeamToIdea>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    contentClassName: 'justify-content-start align-items-center text-center',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'status',
    label: 'Статус',
    size: 'col-3',
    contentClassName: 'justify-content-start align-items-center',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getJoinStatusStyle,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  {
    key: 'skills',
    label: 'Компетенции',
    size: 'col-4',
    contentClassName: 'justify-content-center align-items-center',
    getRowCellStyle: getSkillsStyle,
    getRowCellFormat: getSkillsFormat,
  },
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
    statement: checkRecruitmentIdeaStatus,
    click: (requestToIdea) => openModal(isOpenedAcceptModal, requestToIdea),
  },
  {
    label: 'Отклонить',
    className: 'text-danger',
    statement: checkRecruitmentIdeaStatus,
    click: (requestToIdea) => openModal(isOpenedCancelModal, requestToIdea),
  },
]

function getSkillsFormat(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  return currentSkill.name
}

function getStatusFormat(status: RequestToIdeaStatus) {
  return requestsToTeamStatus.translatedRequests[status]
}

function getSkillsStyle(skills: Skill[], index: number) {
  const { type } = skills[index]
  const skillTypeClass = getSkillInfoStyle(type)

  return [
    'px-2',
    'py-1',
    'rounded',
    'text-center',
    'align-self-start',
    ...skillTypeClass,
  ]
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
    path: 'teams/list/:id',
    alias: '/teams/list/:id',
    component: TeamModal,
  }

  router.addRoute('market', teamModalRoute)
  router.push({ path: `/teams/list/${requestTeam.teamId}` })
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
    const { id } = requestToIdea

    await requestsToIdeaStore.updateRequestToIdea(id, 'CANCELED', token)
  }
}

function checkRecruitmentIdeaStatus(team: RequestTeamToIdea) {
  return props.ideaMarket.status === 'RECRUITMENT_IS_OPEN' && team.status === 'NEW'
}
</script>
