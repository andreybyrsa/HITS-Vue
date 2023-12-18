<template>
  <Table
    :header="marketsTableHeader"
    :columns="marketTableColumns"
    :data="marketData"
    :search-by="['name']"
    :filters="marketFilters"
    :checked-data-actions="checkedMarketsActions"
    :dropdown-actions-menu="dropdownMarketsActions"
    v-model="checkedMarkets"
  />
  <DeleteModal
    :is-opened="isOpenedMarketDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteMarket"
  />
  <!-- <SendIdeasOnMarketModal
      :is-opened="isOpenSendIdeasModal"
      :checked-ideas="sendingIdeasOnMarket"
      @close-modal="closeSendIdeasModal"
      @reset-checked-ideas="resetCheckedMarkets"
    /> -->
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  CheckedDataAction,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'
import GuideTableProps from '@Components/Tables/MarketGuideTable/MarketGuideTable.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import SendIdeasOnMarketModal from '@Components/Modals/SendIdeasOnMarketModal/SendIdeasOnMarketModal.vue' // change
import { Market, MarketStatus } from '@Domain/Market'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import getGuideStatus from '@Utils/getGuideStatus'
import getGuideStatusStyle from '@Utils/getGuideStatusStyle'
import mutableSort from '@Utils/mutableSort'

const props = defineProps<GuideTableProps>()
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const ideaStore = useIdeasStore() // change
const marketData = ref<Market[]>([])
const checkedMarkets = ref<Market[]>([])
const sendingMarketsOnGuide = ref<Market[]>([])
const availableStatus = getGuideStatus()
const deletingMarketId = ref<string | null>(null)
const isOpenedMarketDeleteModal = ref(false)
const filterByMarketStatus = ref<MarketStatus[]>([])

const isOpenSendMarketsModal = ref<boolean>(false)
watchImmediate(
  () => props.market,
  () => {
    marketData.value = props.market
  },
)

const marketsTableHeader = computed<TableHeader>(() => ({
  label: 'Список бирж',
  countData: true,
  buttons: [
    {
      label: 'Создать биржу',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: navigateToCreateMarketForm,
      statement: checkTableHeaderButton(),
    },
  ],
}))

const marketTableColumns: TableColumn<Market>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: navigateToMarketModal,
  },
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getGuideStatusStyle,
    getRowCellFormat: getTranslatedStatus,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
  },
  {
    key: 'finishDate',
    label: 'Дата окончания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByModifiedAt,
  },
]
const checkedMarketsActions = computed<CheckedDataAction<Market>[]>(() => [
  {
    label: 'Отправить на биржу',
    className: 'btn-primary',
    statement:
      user.value?.role == 'PROJECT_OFFICE' &&
      checkedMarkets.value.every((market) => market.status === 'DONE'),
    click: openSendIdeasModal,
  },
])
const dropdownMarketsActions: DropdownMenuAction<Market>[] = [
  {
    label: 'Запустить',
    statement: (market: Market) => market.status === 'NEW',
    click: navigateToMarketModal,
  },
  {
    label: 'Редактировать',
    statement: (market: Market) => ['NEW', 'DONE'].includes(market.status),
    click: navigateToUpdateMarketForm,
  },
  {
    label: 'Завершить',
    statement: (market: Market) => market.status === 'ACTIVE',
    click: navigateToMarketModal,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: (market: Market) => market.status === 'NEW',
    click: handleOpenDeleteModal,
  },
]
const marketFilters: Filter<Market>[] = [
  {
    category: 'Статус',
    choices: availableStatus.status.map((marketStatus) => ({
      label: availableStatus.translatedStatus[marketStatus],
      value: marketStatus,
    })),
    refValue: filterByMarketStatus,
    isUniqueChoice: false,
    checkFilter: checkMarketStatus,
  },
]
function sortByCreatedAt() {
  mutableSort(marketData.value, (marketData: Market) =>
    new Date(marketData.startDate).getTime(),
  )
}
function sortByModifiedAt() {
  mutableSort(marketData.value, (marketData: Market) =>
    new Date(marketData.finishDate).getTime(),
  )
}
function getTranslatedStatus(status: MarketStatus) {
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
function openSendIdeasModal(market: Market[]) {
  sendingMarketsOnGuide.value = [...market]
  isOpenSendMarketsModal.value = true
}
function closeSendIdeasModal() {
  isOpenSendMarketsModal.value = false
}
function resetCheckedMarkets() {
  checkedMarkets.value = []
}
function navigateToMarketModal(market: Market) {
  router.push(`/market/${market.id}`)
}
function navigateToCreateMarketForm() {
  router.push('/markets/create')
}
function navigateToUpdateMarketForm(market: Market) {
  router.push(`/markets/update/${market.id}`)
}
function handleOpenDeleteModal(market: Market) {
  deletingMarketId.value = market.id
  isOpenedMarketDeleteModal.value = true
}
function handleCloseDeleteModal() {
  isOpenedMarketDeleteModal.value = false
}
async function handleDeleteMarket() {
  const currentUser = user.value
  if (currentUser?.token && deletingMarketId.value !== null) {
    const { token } = currentUser
    await ideaStore.deleteIdea(deletingMarketId.value, token) // change store soon
  }
}
function checkTableHeaderButton() {
  const currentUser = user.value
  if (currentUser?.role) {
    return ['INITIATOR', 'ADMIN'].includes(currentUser?.role)
  }
  return false
}

// change

// function checkDeleteIdeaAction(market: Market) {
//   const currentUser = user.value
//   if (currentUser) {
//     const { email } = currentUser
//     const { status } = market
//     const requiredMarketStatus =
//       status === 'NEW' || status === 'ON_EDITING' || status === 'ON_APPROVAL'
//     if (currentUser.role === 'INITIATOR') {
//       return initiatorEmail === email && requiredMarketStatus
//     }
//     return currentUser.role === 'ADMIN'
//   }
//   return false
// }
// function checkUpdateIdeaAction(market: Market) {
//   const currentUser = user.value
//   if (currentUser) {
//     const { email } = currentUser
//     const { status } = market
//     const requiredMarketStatus = status === 'NEW'
//     if (currentUser.role === 'INITIATOR') {
//       return initiatorEmail === email && requiredMarketStatus
//     }
//     return currentUser.role === 'ADMIN'
//   }
//   return false
// }
function checkMarketStatus(market: Market, status: FilterValue) {
  return market.status === status
}
</script>
