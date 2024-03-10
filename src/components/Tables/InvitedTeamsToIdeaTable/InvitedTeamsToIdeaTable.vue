<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { InvitationTeamToIdea, InvitationTeamToIdeaStatus, Skill } from '@Domain'
import { useInvitationsTeamToIdeaStore } from '@Store'
import { getSkillInfoStyle, getJoinStatus, getJoinStatusStyle } from '@Utils'
import { InvitedTeamsToIdeaTableProps } from '@Components/Tables/InvitedTeamsToIdeaTable/InvitedTeamsToIdeaTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

defineProps<InvitedTeamsToIdeaTableProps>()
const selectedTeam = defineModel<InvitationTeamToIdea[]>()

const invitationTeamsToIdeaStore = useInvitationsTeamToIdeaStore()
const { ideaInvitations } = storeToRefs(invitationTeamsToIdeaStore)
const currentInvitationToIdea = ref<InvitationTeamToIdea | null>(null)

const selectedInvitation = ref<InvitationTeamToIdea[]>([])

const router = useRouter()

const requestsToTeamStatus = getJoinStatus()

const isOpenedCancelModal = ref(false)

watchImmediate(
  () => selectedInvitation.value,
  () => {
    selectedTeam.value = selectedInvitation.value
  },
)

const requestToInvitationColumns: TableColumn<InvitationTeamToIdea>[] = [
  {
    key: 'teamName',
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
    key: 'teamMembersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center text-center',
    rowCellClick: navigateToTeamModal,
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

function getStatusFormat(status: InvitationTeamToIdeaStatus) {
  return requestsToTeamStatus.translatedRequests[status]
}

function getSkillsFormat(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  return currentSkill.name
}

function getSkillsStyle(skills: Skill[], index: number) {
  const { type } = skills[index]
  const skillTypeClass = getSkillInfoStyle(type)

  return ['px-2', 'py-1', 'rounded', 'd-flex', 'gap-1', ...skillTypeClass]
}

const dropdownRequestActions: DropdownMenuAction<InvitationTeamToIdea>[] = [
  {
    label: 'Профиль команды',
    click: navigateToTeamModal,
  },
  {
    label: 'Отозвать приглашение',
    className: 'text-danger',
    click: (requestToIdea) => openModal(isOpenedCancelModal, requestToIdea),
    statement: (item) => item.status == 'NEW',
  },
]

function navigateToTeamModal(requestTeam: InvitationTeamToIdea) {
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

function openModal(refValue: Ref<boolean>, requestToIdea: InvitationTeamToIdea) {
  currentInvitationToIdea.value = requestToIdea
  refValue.value = true
}

function closeCancelModal() {
  currentInvitationToIdea.value = null
  isOpenedCancelModal.value = false
}
async function cancelRequestToIdea(invitationToIdea: InvitationTeamToIdea | null) {
  if (invitationToIdea) {
    const { id } = invitationToIdea
    await invitationTeamsToIdeaStore.putInvitationForTeamToIdea('WITHDRAWN', id)
  }
}
</script>

<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="ideaInvitations"
    :columns="requestToInvitationColumns"
    :dropdown-actions-menu="dropdownRequestActions"
    :search-by="['teamName']"
    v-model="selectedInvitation"
  />

  <ConfirmModal
    :is-opened="isOpenedCancelModal"
    text-button="Отозвать приглашение"
    text-question="Команда больше не увидит это приглашение"
    @close-modal="closeCancelModal"
    @action="cancelRequestToIdea(currentInvitationToIdea)"
  />
</template>
