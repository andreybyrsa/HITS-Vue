<template>
  <Table
    :columns="columns"
    :data="teamAccessions"
    :filters="teamAccessionsFilters"
    :dropdown-actions-menu="dropdownTeamAccessionsActions"
  ></Table>

  <DeleteModal
    :is-opened="isOpenedDeleteModal"
    @delete="handleDeleteTeamAccession"
    @close-modal="closeDeleteModal"
  />
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import TeamAccessionsTableProps from '@Components/Tables/TeamAccessionsTable/TeamAccessionsTable.types'

import {
  TeamAccession,
  targetUserType,
  accessionStage,
  requestType,
} from '@Domain/TeamAccession'
import TeamMember from '@Domain/TeamMember'

import useUserStore from '@Store/user/userStore'

import mutableSort from '@Utils/mutableSort'

import TeamService from '@Services/TeamService'

const teamAccessions = defineModel<TeamAccession[]>({ required: true })

const props = defineProps<TeamAccessionsTableProps>()

const router = useRouter()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const filterByTargetType = ref<targetUserType>()
const filterByRequestType = ref<requestType>()
const filterByAccessionStage = ref<accessionStage[]>([])

const deletingAccessionId = ref<number | null>(null)
const isOpenedDeleteModal = ref(false)

const columns: TableColumn<TeamAccession>[] = [
  {
    key: 'targetUserType',
    label: 'Тип основного лица',
    getRowCellFormat: getTargetUserTypeFormat,
    getRowCellStyle: getTargetUserTypeStyle,
  },
  {
    key: 'targetEmail',
    label: 'Основное лицо',
  },
  {
    key: 'stage',
    label: 'Этап',
    getRowCellFormat: getStatusFormat,
  },
  {
    key: 'inviter',
    label: 'Отправитель приглашения',
    getRowCellFormat: getInviterFormat,
  },
  {
    key: 'updatedAt',
    label: 'Последнее обновление',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByUpdatedAt,
  },
]

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
    label: 'Просмотреть заявку',
    statement: checkNavigateToRequestAction,
    click: navigateToRequest,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeleteModal,
    statement: checkDeleteTeamAccession,
  },
]

function getTargetUserTypeFormat(targetUserType: targetUserType) {
  return targetUserType == 'REGISTERED'
    ? 'Пользователь с портала'
    : 'Внешний пользователь'
}

function getTargetUserTypeStyle(targetUserType: targetUserType) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (targetUserType == 'UNREGISTERED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getStatusFormat(stage: accessionStage) {
  return stage == 'INVITATION'
    ? 'Приглашение'
    : stage == 'REQUEST'
    ? 'Заявка'
    : stage == 'ACCEPTED'
    ? 'Принят'
    : 'Отклонено'
}

function getInviterFormat(inviter?: TeamMember) {
  if (inviter) {
    return inviter.firstName + ' ' + inviter.lastName
  }
  return ''
}

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}

function sortByUpdatedAt() {
  mutableSort(teamAccessions.value, (teamAccession: TeamAccession) =>
    new Date(teamAccession.updatedAt).getTime(),
  )
}

function checkTargetUserType(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.targetUserType === filter
}

function checkRequestType(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.requestType === filter
}

function checkAccessionStage(teamAccession: TeamAccession, filter: FilterValue) {
  return teamAccession.stage === filter
}

function checkNavigateToRequestAction(teamAccession: TeamAccession) {
  return teamAccession.stage === 'REQUEST'
}

function navigateToRequest(teamAccession: TeamAccession) {
  router.push(`/teams/list/${props.team.id}/request/${teamAccession.id}`)
}

function checkDeleteTeamAccession(teamAccession: TeamAccession) {
  const currentUser = user.value
  if (currentUser) {
    return (
      currentUser.id == props.team.owner.id ||
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
      return
    }
  }
}
</script>
