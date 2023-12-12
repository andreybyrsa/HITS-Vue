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

import { InvitationToTeamStatus, TeamInvitation } from '@Domain/Team'
import {
  getInvitationsToTeamStatus,
  getInvitationToTeamStatusStyle,
} from '@Utils/invitaionsToTeamStatus'

const props = defineProps<TeamInvitationsProps>()

const teamInvitations = ref<TeamInvitation[]>([])

const router = useRouter()

const invitationsToTeamStatus = getInvitationsToTeamStatus()

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
    getRowCellStyle: getInvitationToTeamStatusStyle,
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

function getStatusFormat(status: InvitationToTeamStatus) {
  return invitationsToTeamStatus.translatedInvitations[status]
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
