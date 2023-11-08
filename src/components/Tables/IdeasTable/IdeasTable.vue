<template>
  <Table
    :columns="iedaTableColumns"
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

const props = defineProps<IdeasTableProps>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

const ideasData = ref<Idea[]>([])

const availableStatus = getStatus()

const deletingIdeaId = ref<number | null>(null)
const isOpenedIdeaDeleteModal = ref(false)

const isSortedByCreatedAt = ref(false)
const isSortedByModifiedAt = ref(false)
const isSortedByPreAssessment = ref(false)
const isSortedByRating = ref(false)

const filterByIdeaStatus = ref<IdeaStatusTypes[]>([])

watchImmediate(
  () => props.ideas,
  () => {
    ideasData.value = props.ideas
  },
)

const iedaTableColumns: TableColumn<Idea>[] = [
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
  ideasData.value.sort((idea1, idea2) => {
    const comparingDate1 = new Date(idea1.createdAt).getTime()
    const comparingDate2 = new Date(idea2.createdAt).getTime()

    if (isSortedByCreatedAt.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByCreatedAt.value = !isSortedByCreatedAt.value
}

function sortByModifiedAt() {
  ideasData.value.sort((idea1, idea2) => {
    const comparingDate1 = new Date(idea1.modifiedAt).getTime()
    const comparingDate2 = new Date(idea2.modifiedAt).getTime()

    if (isSortedByModifiedAt.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByModifiedAt.value = !isSortedByModifiedAt.value
}

function sortByPreAssessment() {
  ideasData.value.sort((idea1, idea2) => {
    const comparingPreAssessment1 = idea1.preAssessment
    const comparingPreAssessment2 = idea2.preAssessment

    if (comparingPreAssessment1 && comparingPreAssessment2) {
      if (isSortedByPreAssessment.value) {
        return comparingPreAssessment1 - comparingPreAssessment2
      } else {
        return comparingPreAssessment2 - comparingPreAssessment1
      }
    } else {
      return -1
    }
  })
  isSortedByPreAssessment.value = !isSortedByPreAssessment.value
}

function sortByRating() {
  ideasData.value.sort((idea1, idea2) => {
    const comparingRating1 = idea1.rating
    const comparingRating2 = idea2.rating

    if (comparingRating1 && comparingRating2) {
      if (isSortedByRating.value) {
        return comparingRating1 - comparingRating2
      } else {
        return comparingRating2 - comparingRating1
      }
    } else {
      return -1
    }
  })
  isSortedByRating.value = !isSortedByRating.value
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
