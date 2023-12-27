<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="teamInvitations"
    :columns="teamInvitationColumns"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownTeamInvitationActions"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter, RouteRecordRaw } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TeamInvitationsProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { getJoinStatus, getJoinStatusStyle } from '@Utils/joinStatus'

import useUserStore from '@Store/user/userStore'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'
import { JoinStatus, TeamInvitation } from '@Domain/Team'

const props = defineProps<TeamInvitationsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const invitationsToTeamStore = useInvitationUsersStore()

const teamInvitations = ref<TeamInvitation[]>([])

const router = useRouter()

const invitationsToTeamStatus = getJoinStatus()

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

function getStatusFormat(status: JoinStatus) {
  return invitationsToTeamStatus.translatedRequests[status]
}

const dropdownTeamInvitationActions: DropdownMenuAction<TeamInvitation>[] = [
  { label: 'Перейти на профиль', click: navigateToUserProfile },
  {
    label: 'Отозвать',
    className: 'text-danger',
    statement: checkWithdrawAction,
    click: withdrawTeamInvitation,
  },
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

function checkWithdrawAction(teaminvitation: TeamInvitation) {
  const currentUser = user.value
  const { owner } = props.team

  return (
    currentUser?.id === owner.id &&
    currentUser.role === 'TEAM_OWNER' &&
    teaminvitation.status === 'NEW'
  )
}

async function withdrawTeamInvitation(teaminvitation: TeamInvitation) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await invitationsToTeamStore.updateInvitationStatus(
      teaminvitation,
      'WITHDRAWN',
      token,
    )
  }
}
</script>
