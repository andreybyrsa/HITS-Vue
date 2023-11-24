<template>
  <Table
    :columns="ideaTableColumns"
    :data="ideasData"
    :search-by="['name', 'description']"
    :filters="ideasFilters"
    :checked-data-actions="checkedIdeasActions"
    :dropdown-actions-menu="dropdownIdeasActions"
  />

  <DeleteModal
    :is-opened="isOpenedIdeaDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteIdea"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
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
import getStatusStyle from '@Utils/getStatusStyle'
import mutableSort from '@Utils/mutableSort'
import getFiltersByRoles from '@Utils/getFiltersByRoles'
import IdeasService from '@Services/IdeasService'

const props = defineProps<IdeasTableProps>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

const filtersByRoles = getFiltersByRoles()

const availableStatus = getStatus()

const ideasData = ref<Idea[]>([])

const deletingIdeaId = ref<string | null>(null)
const isOpenedIdeaDeleteModal = ref(false)

const filterByIdeaStatus = ref<IdeaStatusTypes[]>([])

const filterByConfirmedExpert = ref<boolean>()

watchImmediate(
  () => props.ideas,
  () => {
    ideasData.value = props.ideas
  },
)

watchImmediate(
  () => user.value?.role,
  (role) => {
    if (role) {
      filterByIdeaStatus.value = filtersByRoles.filter[role]
      filterByConfirmedExpert.value = filtersByRoles.filterByExpert[role]
    }
  },
)

const ideaTableColumns: TableColumn<Idea>[] = [
  {
    key: 'checkedBy',
    label: '',
    getRowCellStyle: getCkeckedIdeaStyle,
  },
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
    statement: user.value?.role == 'PROJECT_OFFICE',
    click: () => console.log('market'),
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
  {
    category: 'Экспертиза',
    choices: [
      {
        label: 'Неутвержденные мною идеи',
        value: true,
      },
    ],
    refValue: filterByConfirmedExpert,
    isUniqueChoice: false,
    checkFilter: () => true,
  },
]

watch(filterByConfirmedExpert, async (value) => {
  if (value) {
    const currentUser = user.value

    if (currentUser?.token) {
      const { token } = currentUser

      const response = await IdeasService.getExpertNotConfirmedRating(token)

      if (response instanceof Error) {
        return
      }

      ideasData.value = response
    }
  } else ideasData.value = props.ideas
})

function getCkeckedIdeaStyle(emails: string) {
  const initialClass = ['text-secondary']
  const emailUser = user.value?.email

  if (emailUser && emails.includes(emailUser)) {
    initialClass.splice(0, 1, 'text-success')
    return initialClass
  } else return initialClass
}

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

async function navigateToIdeaModal(idea: Idea) {
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
    const { email } = currentUser
    const { initiatorEmail, status } = idea
    const requiredIdeaStatus =
      status === 'NEW' || status === 'ON_EDITING' || status === 'ON_APPROVAL'

    if (currentUser.role === 'INITIATOR') {
      return initiatorEmail === email && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkUpdateIdeaAction(idea: Idea) {
  const currentUser = user.value

  if (currentUser) {
    const { email } = currentUser
    const { initiatorEmail, status } = idea
    const requiredIdeaStatus = status === 'NEW' || status === 'ON_EDITING'

    if (currentUser.role === 'INITIATOR') {
      return initiatorEmail === email && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkIdeaStatus(idea: Idea, status: FilterValue) {
  return idea.status === status
}
</script>
