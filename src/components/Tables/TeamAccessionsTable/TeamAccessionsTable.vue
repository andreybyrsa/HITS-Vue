<template>
  <router-view></router-view>
  <Table
    v-if="teamAccessions"
    :columns="columns"
    :data="teamAccessions"
    :filters="teamAccessionsFilters"
    :dropdown-actions-menu="dropdownTeamAccessionsActions"
  ></Table>

  <TablePlaceholder v-else />

  <DeleteModal
    :is-opened="isOpenedDeleteModal"
    @delete="handleDeleteTeamAccession"
    @close-modal="closeDeleteModal"
  />

  <TeamAccessionModal
    :is-opened="isOpenedTeamAccessionModal"
    v-model="accession"
    mode="read"
    :type="accession?.requestType"
    @close-modal="closeTeamRequestModal"
    @response="handleResponse"
    @invite="handleSendInviteAgain"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { DropdownMenuAction } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import TeamAccessionsTableProps from '@Components/Tables/TeamAccessionsTable/TeamAccessionsTable.types'
import TeamAccessionModal from '@Components/Modals/TeamAccessionModal/TeamAccessionModal.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import { TeamAccession, accessionStage, requestType } from '@Domain/TeamAccession'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import TeamService from '@Services/TeamService'

const teamAccessions = defineModel<TeamAccession[]>()

defineProps<TeamAccessionsTableProps>()

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

const filterByTargetType = ref<boolean>()
const filterByRequestType = ref<requestType>()
const filterByAccessionStage = ref<accessionStage[]>([])

const deletingAccessionId = ref<number | null>(null)
const isOpenedDeleteModal = ref<boolean>(false)

const accession = ref<TeamAccession>()
const isOpenedTeamAccessionModal = ref<boolean>(false)

const teamAccessionsFilters: Filter<TeamAccession>[] = [
  {
    category: 'Этап',
    choices: [
      { label: 'Приглашение', value: 'INVITATION' },
      { label: 'Заявление', value: 'REQUEST' },
      { label: 'Принято', value: 'ACCEPTED' },
      { label: 'Отклонено', value: 'REJECTED' },
    ],
    refValue: filterByAccessionStage,
    isUniqueChoice: false,
    checkFilter: checkAccessionStage,
  },
  {
    category: 'Тип основного лица',
    choices: [
      { label: 'Внешний пользователь', value: 'UNREGISTERED' },
      { label: 'Пользователь с портала', value: 'REGISTERED' },
    ],
    refValue: filterByTargetType,
    isUniqueChoice: true,
    checkFilter: checkTargetUserType,
  },
  {
    category: 'Тип заявления',
    choices: [
      { label: 'На вступление', value: 'ENTER' },
      { label: 'На выход', value: 'LEAVE' },
    ],
    refValue: filterByRequestType,
    isUniqueChoice: true,
    checkFilter: checkRequestType,
  },
]

const dropdownTeamAccessionsActions: DropdownMenuAction<TeamAccession>[] = [
  {
    label: 'Просмотреть',
    className: 'text-primary',
    click: openTeamRequestModal,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeleteModal,
    statement: checkDeleteTeamAccession,
  },
]

function checkTargetUserType(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.targetRegistered === filter
}

function checkRequestType(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.requestType === filter
}

function checkAccessionStage(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.stage === filter
}

function checkDeleteTeamAccession(teamAccession: TeamAccession) {
  const currentUser = user.value
  if (currentUser) {
    return (
      currentUser.id == teamAccession.team.owner.id ||
      currentUser.role == 'ADMIN' ||
      teamAccession.inviter?.id == currentUser.id
    )
  }
  return false
}

function openDeleteModal(teamAccession: TeamAccession) {
  deletingAccessionId.value = teamAccession.id
  isOpenedDeleteModal.value = true
}

function closeDeleteModal() {
  isOpenedDeleteModal.value = false
}

async function handleDeleteTeamAccession() {
  const currentUser = user.value

  if (currentUser?.token && deletingAccessionId.value) {
    const { token } = currentUser
    const response = await TeamService.deleteTeamAccession(
      deletingAccessionId.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const deletingTeamIndex = teamAccessions.value?.findIndex(
      (teamAccession) => teamAccession.id === deletingAccessionId.value,
    )

    if (deletingTeamIndex !== -1 && deletingTeamIndex) {
      teamAccessions.value?.splice(deletingTeamIndex, 1)
    }

    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

function openTeamRequestModal(teamAccession: TeamAccession) {
  accession.value = teamAccession
  isOpenedTeamAccessionModal.value = true
}

function closeTeamRequestModal() {
  isOpenedTeamAccessionModal.value = false
}

async function handleResponse() {
  const currentUser = user.value
  const currentRequest = accession.value
  if (currentUser?.token && currentRequest) {
    const { token } = currentUser

    const response = await TeamService.responseToRequest(currentRequest, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const responsingTeamRequestIndex = teamAccessions.value?.findIndex(
      (teamAccession) => teamAccession.id == currentRequest.id,
    )

    if (responsingTeamRequestIndex !== -1 && responsingTeamRequestIndex) {
      teamAccessions.value?.splice(responsingTeamRequestIndex, 1)
      teamAccessions.value?.push(currentRequest)
    }

    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

async function handleSendInviteAgain() {
  const currentUser = user.value
  const currentRequest = accession.value
  if (currentUser?.token && currentRequest) {
    const { token, id } = currentUser

    const response = await TeamService.inviteRegisteredUsers(
      [currentRequest.targetEmail],
      currentRequest.id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const responsingTeamRequestIndex = teamAccessions.value?.findIndex(
      (teamAccession) => teamAccession.id == currentRequest.id,
    )

    if (responsingTeamRequestIndex !== -1 && responsingTeamRequestIndex) {
      teamAccessions.value?.splice(responsingTeamRequestIndex, 1)
      const inviter =
        currentRequest.team.leader && currentRequest.team.leader.id == id
          ? currentRequest.team.leader
          : currentRequest.team.owner
      currentRequest.inviter = inviter
      currentRequest.updatedAt = new Date().toJSON()
      currentRequest.stage = 'INVITATION'
      teamAccessions.value?.push(currentRequest)
    }

    return notificationsStore.createSystemNotification('Система', response.success)
  }
}
</script>
