<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TeamMember } from '@Domain'
import { useTeamStore, useUserStore } from '@Store'
import { TeamMembersProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

const props = defineProps<TeamMembersProps>()

const teamsStore = useTeamStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamMembers = ref<TeamMember[]>([])

const router = useRouter()

watchImmediate(
  () => props.team,
  () => {
    teamMembers.value = props.team.members
  },
)

watchImmediate(
  () => props.team.leader,
  () => {
    const { owner, leader } = props.team
    teamMembers.value.sort((a: TeamMember, b: TeamMember) => {
      if (a.id === owner.id) return -1
      if (a.id === leader?.id && b.id !== owner.id) return -1
      if (b.id === owner.id) return 1
      if (b.id === leader?.id && a.id !== owner.id) return 1
      return +a.id - +b.id
    })
  },
)

const teamMemberColumns: TableColumn<TeamMember>[] = [
  {
    key: 'email',
    label: 'Почта',
    size: 'col-5',
    getRowCellStyle: getMemberEmailStyle,
    getRowCellFormat: getMemberEmailFormat,
    rowCellClick: navigateToUserProfile,
  },
  {
    key: 'firstName',
    label: 'Имя',
    size: 'col-3',
  },
  {
    key: 'lastName',
    label: 'Фамилия',
    size: 'col-3',
  },
]

const dropdownTeamMemberActions: DropdownMenuAction<TeamMember>[] = [
  { label: 'Перейти на профиль', click: navigateToUserProfile },
  {
    label: 'Назначить лидером',
    className: 'text-primary',
    statement: checkManageMemberDropdownAction,
    click: appointLeaderTeam,
  },
  {
    label: 'Снять роль лидера',
    className: 'text-danger',
    statement: checkRemoveLeaderRole,
    click: switchLeaderToOwner,
  },
  {
    label: 'Исключить',
    className: 'text-danger',
    statement: checkManageMemberDropdownAction,
    click: kickTeamMember,
  },
]

function getMemberEmailStyle(email: string) {
  const { owner, leader } = props.team

  if (email === owner.email) {
    return 'text-warning'
  }

  if (email === leader?.email) {
    return 'text-primary'
  }

  return 'text-dark'
}

function getMemberEmailFormat(email: string) {
  const { owner, leader } = props.team

  if (email === owner.email) {
    return `${email} (Владелец)`
  }

  if (email === leader?.email) {
    return `${email} (Тим-лидер)`
  }

  return email
}

function navigateToUserProfile(teamMember: TeamMember) {
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
  router.push({ path: `/profile/${teamMember.id}` })
}

async function kickTeamMember(teamMember: TeamMember) {
  const { id } = props.team
  await teamsStore.kickTeamMember(id, teamMember.id)
}

async function appointLeaderTeam(teamMember: TeamMember) {
  const { id } = props.team
  await teamsStore.changeLeaderTeamMember(id, teamMember)
}

async function switchLeaderToOwner() {
  const { id, owner } = props.team
  await teamsStore.changeLeaderTeamMember(id, owner)
}

function checkManageMemberDropdownAction(teamMember: TeamMember) {
  const currentUser = user.value
  const { owner, leader } = props.team

  return (
    (currentUser?.id === owner.id &&
      currentUser?.role === 'TEAM_OWNER' &&
      teamMember.id !== owner.id &&
      teamMember.id !== leader?.id) ||
    currentUser?.role === 'ADMIN'
  )
}

function checkRemoveLeaderRole(teamMember: TeamMember) {
  const currentUser = user.value
  const { owner, leader } = props.team

  return (
    (currentUser?.id === owner.id &&
      currentUser?.role === 'TEAM_OWNER' &&
      teamMember.id !== owner.id &&
      teamMember.id === leader?.id) ||
    currentUser?.role === 'ADMIN'
  )
}
</script>

<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="teamMembers"
    :columns="teamMemberColumns"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownTeamMemberActions"
  />
</template>
