<template>
  <Table
    :columns="teamTableColumns"
    :data="teams"
    search-by="name"
    :filters="teamsFilters"
    :dropdown-actions-menu="dropdownTeamsActions"
  ></Table>

  <DeleteModal
    :is-opened="isOpenedTeamDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteTeam"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import Team from '@Domain/Team'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const teams = defineModel<Team[]>({ required: true })

const deletingTeamId = ref<number | null>(null)
const isOpenedTeamDeleteModal = ref(false)

const filterByIsClosed = ref<boolean>()

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)

const teamTableColumns: TableColumn<Team>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'closed',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getStatusStyle,
    getRowCellFormat: getTranslatedStatus,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  {
    key: 'createdAt',
    label: 'Дата создания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
  },
]

const dropdownTeamsActions: DropdownMenuAction<Team>[] = [
  {
    label: 'Просмотреть',
    click: navigateToTeamModal,
  },
  {
    label: 'Редактировать',
    statement: checkUpdateTeamAction,
    click: navigateToTeamForm,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkDeleteTeamAction,
    click: handleOpenDeleteModal,
  },
]

const teamsFilters: Filter<Team>[] = [
  {
    category: 'Статус',
    choices: [
      { label: 'Открытая команда', value: false },
      { label: 'Закрытая команда', value: true },
    ],
    refValue: filterByIsClosed,
    isUniqueChoice: true,
    checkFilter: checkTeamStatus,
  },
]

function sortByCreatedAt() {
  teams.value.sort((team1, team2) => {
    const comparingDate1 = new Date(team1.createdAt).getTime()
    const comparingDate2 = new Date(team2.createdAt).getTime()

    if (isSortedByCreatedAt.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByCreatedAt.value = !isSortedByCreatedAt.value
}

function sortByMembersCount() {
  teams.value.sort((team1, team2) => {
    const comparingDate1 = new Date(team1.membersCount).getTime()
    const comparingDate2 = new Date(team2.membersCount).getTime()

    if (isSortedByMembersCount.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByMembersCount.value = !isSortedByMembersCount.value
}

function getStatusStyle(isClosed: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (isClosed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getTranslatedStatus(isClosed: boolean) {
  return isClosed ? 'Закрыта' : 'Открыта'
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function navigateToTeamModal(team: Team) {
  router.push(`/teams/list/${team.id}`)
}

function navigateToTeamForm(team: Team) {
  router.push(`/teams/update/${team.id}`)
}

function handleOpenDeleteModal(team: Team) {
  deletingTeamId.value = team.id
  isOpenedTeamDeleteModal.value = true
}

function handleCloseDeleteModal() {
  isOpenedTeamDeleteModal.value = false
}

async function handleDeleteTeam() {
  const currentUser = user.value

  if (currentUser?.token && deletingTeamId.value !== null) {
    const { token } = currentUser

    const response = await TeamService.deleteTeam(deletingTeamId.value, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const deletingTeamIndex = teams.value.findIndex(
      (team) => team.id === deletingTeamId.value,
    )

    if (deletingTeamIndex !== -1) {
      teams.value.splice(deletingTeamIndex, 1)
    }
  }
}

function checkDeleteTeamAction(team: Team) {
  const currentUser = user.value

  const { owner } = team
  return currentUser?.role === 'ADMIN' || currentUser?.email === owner.email
}

function checkUpdateTeamAction(team: Team) {
  const currentUser = user.value

  const { owner, leader } = team
  return (
    currentUser?.role === 'ADMIN' ||
    currentUser?.email === owner.email ||
    currentUser?.email === leader.email
  )
}

function checkTeamStatus(team: Team, status: FilterValue) {
  return team.closed === status
}
</script>
