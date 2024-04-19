<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import InvitedTeamsToIdeaTableProps from '@Components/Tables/InvitedTeamsToIdeaTable/InvitedTeamsToIdeaTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

import {
  InvitationTeamToIdea,
  InvitationTeamToIdeaStatus,
} from '@Domain/InvitationTeamToIdea'

import useUserStore from '@Store/user/userStore'
import useInvitationsTeamToIdeaStore from '@Store/invitationTeamToIdea/invitationTeamToIdeaStore'
import { getSkillInfoStyle } from '@Utils/skillsInfo'
import { Skill } from '@Domain/Skill'
import { getJoinStatus, getJoinStatusStyle } from '@Utils/joinStatus'

defineProps<InvitedTeamsToIdeaTableProps>()
const selectedTeam = defineModel<InvitationTeamToIdea[]>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  const currentUser = user.value

  if (currentUser?.token && invitationToIdea) {
    const { token } = currentUser
    const { id } = invitationToIdea

    await invitationTeamsToIdeaStore.putInvitationForTeamToIdea(
      'WITHDRAWN',
      id,
      token,
    )
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
