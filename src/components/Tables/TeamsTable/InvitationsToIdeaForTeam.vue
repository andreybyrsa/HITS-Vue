<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
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
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

import IdeaMarketModal from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.vue'
import { InvitationsToIdeaForTeamTableProps } from '@Components/Modals/TeamModal/TeamModal.types'

const props = defineProps<InvitationsToIdeaForTeamTableProps>()
const selectedTeam = defineModel<InvitationTeamToIdea[]>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const invitationTeamsToIdeaStore = useInvitationsTeamToIdeaStore()
const { ideaInvitations } = storeToRefs(invitationTeamsToIdeaStore)

const currentInvitationToIdea = ref<InvitationTeamToIdea | null>(null)

const selectedInvitation = ref<InvitationTeamToIdea[]>([])

const requestsToTeamStatus = getJoinStatus()

const isOpenedConfirmModal = ref(false)
const isOpenedRevokeModal = ref(false)

watchImmediate(
  () => selectedInvitation.value,
  () => {
    selectedTeam.value = selectedInvitation.value
  },
)

const requestToInvitationColumns: TableColumn<InvitationTeamToIdea>[] = [
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getJoinStatusStyle,
  },
  {
    key: 'ideaName',
    label: 'Название',
    size: 'col-5',
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
    label: 'Просмотр команды',
    click: navigateToTeamModal,
  },
  {
    label: 'Принять приглашение',
    click: (requestToIdea) => openModal(isOpenedConfirmModal, requestToIdea),
    statement: (item) =>
      item.status == 'NEW' &&
      user.value?.role !== 'ADMIN' &&
      !props.team.hasActiveProject,
  },
  {
    label: 'Отклонить приглашение',
    className: 'text-danger',
    click: (requestToIdea) => openModal(isOpenedRevokeModal, requestToIdea),
    statement: (item) =>
      item.status == 'NEW' &&
      user.value?.role !== 'ADMIN' &&
      !props.team.hasActiveProject,
  },
]

function navigateToTeamModal(invitation: InvitationTeamToIdea) {
  const ideaMarketRoute: RouteRecordRaw = {
    name: 'market-idea-modal',
    path: 'market/:marketId/:ideaMarketId',
    alias: '/market/:marketId/:ideaMarketId',
    component: IdeaMarketModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute('teams-list', `${invitation.ideaId}`, ideaMarketRoute)
}

function openModal(refValue: Ref<boolean>, requestToIdea: InvitationTeamToIdea) {
  currentInvitationToIdea.value = requestToIdea
  refValue.value = true
}

function closeConfirmModal() {
  currentInvitationToIdea.value = null
  isOpenedConfirmModal.value = false
}

function closeRevokeModal() {
  currentInvitationToIdea.value = null
  isOpenedRevokeModal.value = false
}

async function handleAcceptInvitationToIdea(
  invitationToIdea: InvitationTeamToIdea | null,
) {
  const currentUser = user.value

  if (currentUser?.token && invitationToIdea) {
    const { token } = currentUser
    const { id, ideaId } = invitationToIdea

    await invitationTeamsToIdeaStore.putInvitationForTeamToIdea(
      'ACCEPTED',
      id,
      token,
      ideaId,
      props.team,
    )
  }
}

async function handleRevokeInvitationToIdea(
  invitationToIdea: InvitationTeamToIdea | null,
) {
  const currentUser = user.value

  if (currentUser?.token && invitationToIdea) {
    const { token } = currentUser
    const { id } = invitationToIdea
    const status = 'CANCELED'

    await invitationTeamsToIdeaStore.putInvitationForTeamToIdea(status, id, token)
  }
}
</script>
<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="ideaInvitations"
    :columns="requestToInvitationColumns"
    :dropdown-actions-menu="dropdownRequestActions"
    :search-by="['ideaName']"
    v-model="selectedInvitation"
  />

  <ConfirmModal
    :is-opened="isOpenedRevokeModal"
    text-button="Отклонить приглашение"
    text-question="Ваша команда отклонит приглашение в идею."
    @close-modal="closeRevokeModal"
    @action="handleRevokeInvitationToIdea(currentInvitationToIdea)"
  />
  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Принять приглашение"
    text-question="Ваша команда приступит к выполнению идеи"
    :textNotDanger="true"
    @close-modal="closeConfirmModal"
    @action="handleAcceptInvitationToIdea(currentInvitationToIdea)"
  />
</template>
