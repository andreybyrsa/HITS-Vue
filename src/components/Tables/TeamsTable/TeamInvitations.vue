<template>
  <Table
    :data="teamInvitations"
    :columns="teamInvitationColumns"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownTeamInvitationActions"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TeamInvitationsProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { RequestToTeamStatus, TeamInvitation } from '@Domain/Team'

const props = defineProps<TeamInvitationsProps>()

const teamInvitations = ref<TeamInvitation[]>([])

const router = useRouter()

watchImmediate(
  () => props.invitations,
  (invitations) => {
    teamInvitations.value = invitations
  },
)

const teamInvitationColumns: TableColumn<TeamInvitation>[] = [
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

const dropdownTeamInvitationActions: DropdownMenuAction<TeamInvitation>[] = [
  { label: 'Перейти на профиль', click: navigateToUserProfile },
]

function navigateToUserProfile(invitation: TeamInvitation) {
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
  router.push({ path: `/profile/${invitation.userId}` })
}
</script>
