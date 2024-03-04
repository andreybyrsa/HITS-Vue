<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Idea, IdeaStatusType } from '@Domain'
import { useUserStore, useIdeasStore, useRatingsStore } from '@Store'
import {
  getFiltersByRoles,
  mutableSort,
  getIdeaStatus,
  getIdeaStatusStyle,
} from '@Utils'
import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  CheckedDataAction,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import SendIdeasOnMarketModal from '@Components/Modals/SendIdeasOnMarketModal/SendIdeasOnMarketModal.vue'

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ratingsStore = useRatingsStore()
const { ratings } = storeToRefs(ratingsStore)

const ideaStore = useIdeasStore()
const { ideas } = storeToRefs(ideaStore)

const checkedIdeas = ref<Idea[]>([])
const sendingIdeasOnMarket = ref<Idea[]>([])
const filtersByRoles = getFiltersByRoles()

const availableStatus = getIdeaStatus()

const deletingIdeaName = ref<string>()
const deletingIdeaId = ref<string | null>(null)
const isOpenedIdeaDeleteModal = ref(false)

const filterByIdeaStatus = ref<IdeaStatusType[]>([])

const isOpenSendIdeasModal = ref<boolean>(false)

const filterByConfirmedExpert = ref<boolean>(true)

watchImmediate(
  () => user.value?.role,
  (role) => {
    if (role) {
      filterByIdeaStatus.value = filtersByRoles.filter[role]
      filterByConfirmedExpert.value = filtersByRoles.filterByExpert[role]
    }
  },
)

watchImmediate(filterByConfirmedExpert, async (value) => {
  const currentUser = user.value

  if (currentUser?.role) {
    const { role } = currentUser

    if (value) {
      return await ideaStore.getExpertNotConfirmedIdeas()
    }

    return await ideaStore.getIdeas(role)
  }
})

watch(
  ratings,
  async () => {
    if (user.value) {
      const { id } = user.value

      const confirmedIdeaIdsByExpert = ratings.value.map(
        ({ ideaId, ideaRatings }) => {
          const isConfirmedIdea = ideaRatings.find(
            ({ expertId, isConfirmed }) => expertId === id && isConfirmed,
          )

          if (isConfirmedIdea) return ideaId
        },
      )

      ideas.value = ideas.value.filter(
        (idea) => !confirmedIdeaIdsByExpert.includes(idea.id),
      )
    }
  },
  { deep: true },
)

const ideasTableHeader = computed<TableHeader>(() => ({
  label: 'Список идей',
  countData: true,
  buttons: [
    {
      label: 'Создать идею',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: navigateToCreateIdeaForm,
      statement: checkTableHeaderButton(),
    },
  ],
}))

const ideaTableColumns: TableColumn<Idea>[] = [
  {
    key: 'isChecked',
    label: '',
    getRowCellStyle: getCkeckedIdeaStyle,
    getRowCellFormat: () => '',
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
    getRowCellStyle: getIdeaStatusStyle,
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

const checkedIdeasActions = computed<CheckedDataAction<Idea>[]>(() => [
  {
    label: 'Отправить на биржу',
    className: 'btn-primary',
    statement:
      user.value?.role == 'PROJECT_OFFICE' &&
      checkedIdeas.value.every((idea) => idea.status === 'CONFIRMED'),
    click: openSendIdeasModal,
  },
])

const dropdownIdeasActions: DropdownMenuAction<Idea>[] = [
  {
    label: 'Просмотреть',
    click: navigateToIdeaModal,
  },
  {
    label: 'Редактировать',
    statement: checkUpdateIdeaAction,
    click: navigateToUpdateIdeaForm,
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
    statement: computed(() => user.value?.role === 'EXPERT'),
  },
]

function getCkeckedIdeaStyle(checkedBy: boolean) {
  const initialClass = ['bi bi-circle-fill', 'fs-6', 'mt-1', 'text-secondary']

  if (checkedBy) {
    initialClass.splice(3, 1, 'text-success')
    return initialClass
  } else return initialClass
}

function sortByCreatedAt() {
  mutableSort(ideas.value, (ideaData: Idea) =>
    new Date(ideaData.createdAt).getTime(),
  )
}

function sortByModifiedAt() {
  mutableSort(ideas.value, (ideaData: Idea) =>
    new Date(ideaData.modifiedAt).getTime(),
  )
}

function sortByPreAssessment() {
  mutableSort(ideas.value, (ideaData: Idea) => ideaData.preAssessment)
}

function sortByRating() {
  mutableSort(ideas.value, (ideaData: Idea) => ideaData.rating)
}

function getTranslatedStatus(status: IdeaStatusType) {
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

function openSendIdeasModal(ideas: Idea[]) {
  sendingIdeasOnMarket.value = [...ideas]
  isOpenSendIdeasModal.value = true
}
function closeSendIdeasModal() {
  isOpenSendIdeasModal.value = false
}

function navigateToIdeaModal(idea: Idea) {
  router.push(`/ideas/list/${idea.id}`)
}

function navigateToCreateIdeaForm() {
  router.push('/ideas/create')
}

function navigateToUpdateIdeaForm(idea: Idea) {
  router.push(`/ideas/update/${idea.id}`)
}

function handleOpenDeleteModal(idea: Idea) {
  deletingIdeaId.value = idea.id
  deletingIdeaName.value = idea.name
  isOpenedIdeaDeleteModal.value = true
}

function handleCloseDeleteModal() {
  isOpenedIdeaDeleteModal.value = false
}

async function handleDeleteIdea() {
  if (deletingIdeaId.value !== null) {
    await ideaStore.deleteIdea(deletingIdeaId.value)
  }
}

function checkTableHeaderButton() {
  const currentUser = user.value

  if (currentUser?.role) {
    return ['INITIATOR', 'ADMIN'].includes(currentUser?.role)
  }
  return false
}

function checkDeleteIdeaAction(idea: Idea) {
  const currentUser = user.value

  if (currentUser) {
    const { id } = currentUser
    const { initiator, status } = idea
    const requiredIdeaStatus =
      status === 'NEW' || status === 'ON_EDITING' || status === 'ON_APPROVAL'

    if (currentUser.role === 'INITIATOR') {
      return initiator.id === id && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkUpdateIdeaAction(idea: Idea) {
  const currentUser = user.value

  if (currentUser) {
    const { id } = currentUser
    const { initiator, status } = idea
    const requiredIdeaStatus = status === 'NEW' || status === 'ON_EDITING'

    if (currentUser.role === 'INITIATOR') {
      return initiator.id === id && requiredIdeaStatus
    }

    return currentUser.role === 'ADMIN'
  }
  return false
}

function checkIdeaStatus(idea: Idea, status: FilterValue) {
  return idea.status === status
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="ideasTableHeader"
    :columns="ideaTableColumns"
    :data="ideas"
    :search-by="['name', 'description']"
    :filters="ideasFilters"
    :checked-data-actions="checkedIdeasActions"
    :dropdown-actions-menu="dropdownIdeasActions"
    v-model="checkedIdeas"
    :isCheckbox="user?.role === 'PROJECT_OFFICE'"
  />

  <DeleteModal
    :is-opened="isOpenedIdeaDeleteModal"
    :item-name="deletingIdeaName"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteIdea"
  />

  <SendIdeasOnMarketModal
    :is-opened="isOpenSendIdeasModal"
    :ideas="sendingIdeasOnMarket"
    @close-modal="closeSendIdeasModal"
  />
</template>
