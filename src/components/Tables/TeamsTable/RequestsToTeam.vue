<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="requests"
    :columns="requestToTeamColumns"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownRequestToTeamActions"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModalAccepted"
    text-button="Принять заявку"
    text-question="Вы действительно хотите принять заявку?"
    @close-modal="closeConfirmModal"
    @action="acceptRequestToTeam"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModalCancel"
    text-button="Отклонить заявку"
    text-question="Вы действительно хотите отклонить заявку?"
    @close-modal="closeConfirmModal"
    @action="cancelRequestToTeam"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { RequestsToTeamProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

import { RequestToTeam, JoinStatus } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import useRequestsToTeamStore from '@Store/requestsToTeam/requestsToTeamStore'

import { getJoinStatus, getJoinStatusStyle } from '@Utils/joinStatus'

const props = defineProps<RequestsToTeamProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToTeamStore = useRequestsToTeamStore()

const router = useRouter()

const requestsToTeamStatus = getJoinStatus()

const requestToTeamColumns: TableColumn<RequestToTeam>[] = [
  {
    key: 'status',
    label: 'Статус',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getJoinStatusStyle,
  },
  {
    key: 'email',
    label: 'Почта',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
    rowCellClick: navigateToUserProfile,
  },
  {
    key: 'firstName',
    label: 'Имя',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
  },
  {
    key: 'lastName',
    label: 'Фамилия',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
  },
]

const dropdownRequestToTeamActions: DropdownMenuAction<RequestToTeam>[] = [
  { label: 'Перейти на профиль', click: navigateToUserProfile },
  {
    label: 'Принять',
    className: 'text-success',
    statement: checkDropdownAction,
    click: openConfirmModalAccepted,
  },
  {
    label: 'Отклонить',
    className: 'text-danger',
    statement: checkDropdownAction,
    click: openConfirmModalCancel,
  },
]

function getStatusFormat(status: JoinStatus) {
  return requestsToTeamStatus.translatedRequests[status]
}

function navigateToUserProfile(request: RequestToTeam) {
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: ProfileModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('teams-list', profileRoute)
  router.push({ path: `/profile/${request.userId}` })
}

const isOpenedConfirmModalAccepted = ref(false)
const isOpenedConfirmModalCancel = ref(false)
const requestToTeam = ref<RequestToTeam>()

function openConfirmModalAccepted(request: RequestToTeam) {
  requestToTeam.value = request
  isOpenedConfirmModalAccepted.value = true
}

function openConfirmModalCancel(request: RequestToTeam) {
  requestToTeam.value = request
  isOpenedConfirmModalCancel.value = true
}

function closeConfirmModal() {
  requestToTeam.value = undefined
  isOpenedConfirmModalAccepted.value = false
  isOpenedConfirmModalCancel.value = false
}

async function acceptRequestToTeam() {
  const currentUser = user.value

  if (currentUser?.token && requestToTeam.value) {
    const { token } = currentUser

    await requestsToTeamStore.updateRequestToTeamStatus(
      requestToTeam.value,
      'ACCEPTED',
      token,
    )

    requestToTeam.value = undefined
    isOpenedConfirmModalAccepted.value = false
  }
}

async function cancelRequestToTeam() {
  const currentUser = user.value

  if (currentUser?.token && requestToTeam.value) {
    const { token } = currentUser

    await requestsToTeamStore.updateRequestToTeamStatus(
      requestToTeam.value,
      'CANCELED',
      token,
    )

    requestToTeam.value = undefined
    isOpenedConfirmModalCancel.value = false
  }
}

function checkDropdownAction(requestToTeam: RequestToTeam) {
  const currentUser = user.value
  const { owner } = props.team

  return (
    (requestToTeam.status === 'NEW' && owner.id === currentUser?.id) ||
    currentUser?.role === 'ADMIN'
  )
}
</script>
