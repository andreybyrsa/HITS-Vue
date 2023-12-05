<template>
  <div></div>
  <!-- <Table
    :data="users"
    :columns="requestToTeamColumns"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownRequestToTeamActions"
  /> -->
</template>

<script lang="ts" setup>
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { RequestsToTeamProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { RequestToTeam, RequestToTeamStatus } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import { ref } from 'vue'

const props = defineProps<RequestsToTeamProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const requestToTeamColumns: TableColumn<RequestToTeam>[] = [
  {
    key: 'status',
    label: 'Статус',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getStatusStyle,
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

function getStatusFormat(status: RequestToTeamStatus) {
  if (status === 'NEW') {
    return 'Новая'
  }

  if (status === 'ACCEPTED') {
    return 'Принята'
  }

  if (status === 'CANCELED') {
    return 'Отклонена'
  }
}

function getStatusStyle(status: RequestToTeamStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ACCEPTED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'CANCELED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
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

function openConfirmModalAccepted(team: RequestToTeam) {
  requestToTeam.value = team
  isOpenedConfirmModalAccepted.value = true
}

function openConfirmModalCancel(team: RequestToTeam) {
  requestToTeam.value = team
  isOpenedConfirmModalCancel.value = true
}

function checkDropdownAction(requestToTeam: RequestToTeam) {
  const currentUser = user.value
  const { leader, owner } = props.team

  return (
    requestToTeam.status !== 'CANCELED' &&
    requestToTeam.status !== 'ACCEPTED' &&
    (leader?.userId === currentUser?.id || owner.userId === currentUser?.id)
  )
}
</script>
