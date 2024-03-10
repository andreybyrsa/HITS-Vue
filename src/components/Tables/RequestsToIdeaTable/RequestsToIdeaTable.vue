<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { Skill, RequestTeamToIdea, RequestToIdeaStatus } from '@Domain'
import { useRequestsToIdeaStore } from '@Store'
import {
  mutableSort,
  getSkillInfoStyle,
  getJoinStatus,
  getJoinStatusStyle,
} from '@Utils'
import { RequestsToIdeaTableProps } from '@Components/Tables/RequestsToIdeaTable/RequestsToIdeaTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'

const props = defineProps<RequestsToIdeaTableProps>()
const selectedTeam = defineModel<RequestTeamToIdea[]>()

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
    label: 'Кометенции',
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
    name: 'team-modal',
    path: 'team/:teamId',
    alias: '/team/:teamId',
    meta: { from: 'market-ideas' },
    component: TeamModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('market-ideas', teamModalRoute)
  router.push({ path: `/team/${requestTeam.teamId}` })
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
  if (requestToIdea) {
    await requestsToIdeaStore.acceptRequestToIdea(requestToIdea)
    await requestsToIdeaStore.updateRequestToIdea(
      requestToIdea.id,
      'ACCEPTED',
      props.ideaMarket.ideaId,
      requestToIdea.teamId,
      props.ideaMarket.id,
    )
  }
}

async function cancelRequestToIdea(requestToIdea: RequestTeamToIdea | null) {
  if (requestToIdea) {
    const { id } = requestToIdea
    await requestsToIdeaStore.updateRequestToIdea(id, 'CANCELED')
  }
}

function checkRecruitmentIdeaStatus(team: RequestTeamToIdea) {
  return props.ideaMarket.status === 'RECRUITMENT_IS_OPEN' && team.status === 'NEW'
}
</script>

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
    :idea-market="ideaMarket"
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
