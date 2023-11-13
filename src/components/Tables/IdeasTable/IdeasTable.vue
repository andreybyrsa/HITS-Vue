<template>
  <Table
    :columns="ideaTableColumns"
    :data="ideasData"
    :search-by="['name', 'description']"
    :filters="ideasFilters"
    :checked-data-actions="checkedIdeasActions"
    :dropdown-actions-menu="dropdownIdeasActions"
  ></Table>

  <DeleteModal
    :is-opened="isOpenedIdeaDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteIdea"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  CheckedDataAction,
  DropdownMenuAction,
} from '@Components/Table/Table.types'
import IdeasTableProps from '@Components/Tables/IdeasTable/IdeasTable.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import { Idea } from '@Domain/Idea'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

import getStatus from '@Utils/getStatus'
import mutableSort from '@Utils/mutableSort'

const props = defineProps<IdeasTableProps>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

const ideasData = ref<Idea[]>([])

const availableStatus = getStatus()

const deletingIdeaId = ref<number | null>(null)
const isOpenedIdeaDeleteModal = ref(false)

const filterByIdeaStatus = ref<IdeaStatusTypes[]>([])

watchImmediate(
  () => props.ideas,
  () => {
    ideasData.value = props.ideas
  },
)

const ideaTableColumns: TableColumn<Idea>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: navigateToIdeaModal,
  },
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getStatusStyle,
    getRowCellFormat: getTranslatedStatus,
  },
  {
    key: 'createdAt',
    label: 'Дата создания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
  },
  {
    key: 'modifiedAt',
    label: 'Дата изменения',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByModifiedAt,
  },
  {
    key: 'preAssessment',
    label: 'Оценка',
    size: 'col-1',
    contentClassName: 'justify-content-center',
    getRowCellStyle: getRatingColor,
    getRowCellFormat: getRoundedNumber,
    headerCellClick: sortByPreAssessment,
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    size: 'col-1',
    contentClassName: 'justify-content-center',
    getRowCellStyle: getRatingColor,
    getRowCellFormat: getRoundedNumber,
    headerCellClick: sortByRating,
  },
]

const checkedIdeasActions: CheckedDataAction<Idea>[] = [
  {
    label: 'Отправить на биржу',
    className: 'btn-primary',
    statement: user.value?.role === 'PROJECT_OFFICE',
    click: sendIdeasToMarket,
  },
]

const dropdownIdeasActions: DropdownMenuAction<Idea>[] = [
  {
    label: 'Просмотреть',
    click: navigateToIdeaModal,
  },
  {
    label: 'Редактировать',
    statement: checkUpdateIdeaAction,
    click: navigateToIdeaForm,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkDeleteIdeaAction,
    click: handleOpenDeleteModal,
  },
]

const ideasFilters: Filter<Idea>[] = [
  {
    category: 'Статус',
    choices: availableStatus.status.map((ideaStatus) => ({
      label: availableStatus.translatedStatus[ideaStatus],
      value: ideaStatus,
    })),
    refValue: filterByIdeaStatus,
    isUniqueChoice: false,
    checkFilter: checkIdeaStatus,
  },
]

function sortByCreatedAt() {
  mutableSort(ideasData.value, (ideaData: Idea) =>
    new Date(ideaData.createdAt).getTime(),
  )
}

function sortByModifiedAt() {
  mutableSort(ideasData.value, (ideaData: Idea) =>
    new Date(ideaData.modifiedAt).getTime(),
  )
}

function sortByPreAssessment() {
  mutableSort(ideasData.value, (ideaData: Idea) => ideaData.preAssessment)
}

function sortByRating() {
  mutableSort(ideasData.value, (ideaData: Idea) => ideaData.rating)
}

function getStatusStyle(status: IdeaStatusTypes) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ON_EDITING' || status === 'ON_APPROVAL') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'ON_CONFIRMATION') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  if (status === 'CONFIRMED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}

function getTranslatedStatus(status: IdeaStatusTypes) {
  return availableStatus.translatedStatus[status].toString()
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getRoundedNumber(rating: number | null) {
  return rating?.toFixed(1)
}

function getRatingColor(rating: number) {
  if (rating >= 4.0) {
    return 'text-success'
  }
  if (rating < 4.0 && rating >= 3.0) {
    return 'text-warning'
  }
  return 'text-danger'
}

function sendIdeasToMarket(ideas: Idea[]) {
  console.log(ideas)
}

function navigateToIdeaModal(idea: Idea) {
  router.push(`/ideas/list/${idea.id}`)
}

function navigateToIdeaForm(idea: Idea) {
  router.push(`/ideas/update/${idea.id}`)
}

function handleOpenDeleteModal(idea: Idea) {
  deletingIdeaId.value = idea.id
  isOpenedIdeaDeleteModal.value = true
}

function handleCloseDeleteModal() {
  isOpenedIdeaDeleteModal.value = false
}

async function handleDeleteIdea() {
  const currentUser = user.value

  if (currentUser?.token && deletingIdeaId.value !== null) {
    const { token } = currentUser
    await ideaStore.deleteIdea(deletingIdeaId.value, token)
  }
}

function checkDeleteIdeaAction(idea: Idea) {
  const currentUser = user.value

  if (currentUser) {
    const { initiator, status } = idea
    const requiredIdeaStatus =
      status === 'NEW' || status === 'ON_EDITING' || status === 'ON_APPROVAL'

    if (currentUser.role === 'INITIATOR') {
      return initiator === `${currentUser.id}` && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkUpdateIdeaAction(idea: Idea) {
  const currentUser = user.value

  if (currentUser) {
    const { initiator, status } = idea
    const requiredIdeaStatus = status === 'NEW' || status === 'ON_EDITING'

    if (currentUser.role === 'INITIATOR') {
      return initiator === `${currentUser.id}` && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkIdeaStatus(idea: Idea, status: FilterValue) {
  return idea.status === status
}
</script>
