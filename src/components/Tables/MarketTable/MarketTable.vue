<template>
  <Table
    :header="marketTableHeader"
    :columns="marketTableColumns"
    :data="markets"
    :search-by="['name']"
    :filters="marketFilters"
    :dropdown-actions-menu="dropdownMarketActions"
  />

  <MarketModal
    :is-opened="isOpenedMarketModal"
    :market="currentMarket"
    @close-modal="closeMarketModal"
  />

  <ConfirmModal
    :is-opened="isOpenedStartMarketConfirmation"
    :text-question="startMarketConfirmationText"
    text-button="Запустить биржу"
    @close-modal="closeStartMarketConfirmationModal"
    @action="handleUpdateMarketStatus('ACTIVE')"
  />

  <ConfirmModal
    :is-opened="isOpenedFinishMarketConfirmation"
    :text-question="finishMarketConfirmationText"
    text-button="Завершить биржу"
    @close-modal="closeFinishMarketConfirmationModal"
    @action="handleUpdateMarketStatus('DONE')"
  />

  <DeleteModal
    :is-opened="isOpenedDeletingMarketModal"
    @close-modal="closeDeletingMarketModal"
    @delete="handleDeleteMarket"
  />
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import MarketModal from '@Components/Modals/MarketModal/MarketModal.vue'

import { Market, MarketStatus } from '@Domain/Market'

import useUserStore from '@Store/user/userStore'
import useMarketsStore from '@Store/markets/marketsStore'

import { getMarketStatus, getMarketStatusStyle } from '@Utils/marketStatus'
import mutableSort from '@Utils/mutableSort'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const marketsStore = useMarketsStore()
const { markets } = storeToRefs(marketsStore)
const currentMarket = ref<Market | null>(null)

const marketStatusInfo = getMarketStatus()
const filterByMarketStatus = ref<MarketStatus[]>([])

const router = useRouter()
const route = useRoute()

const startMarketConfirmationText =
  'Вы действительно хотите запустить биржу? Активную биржу можно будет ТОЛЬКО завершить.'
const finishMarketConfirmationText =
  'Вы действительно хотите завершить биржу? Идеи, не нашедшие команды, попадут обратно в список идей.'

const isOpenedMarketModal = ref(false)
const isOpenedDeletingMarketModal = ref(false)

const isOpenedStartMarketConfirmation = ref(false)
const isOpenedFinishMarketConfirmation = ref(false)

const marketTableHeader = computed<TableHeader>(() => ({
  label: 'Список бирж',
  countData: true,
  buttons: [
    {
      label: 'Создать биржу',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: () => openModalAndStoreMarket(isOpenedMarketModal, null),
    },
  ],
}))

const marketTableColumns: TableColumn<Market>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: navigateToMarket,
  },
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getMarketStatusStyle,
    getRowCellFormat: getTranslatedStatus,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByStartDate,
  },
  {
    key: 'finishDate',
    label: 'Дата окончания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByFinishDate,
  },
]

const dropdownMarketActions: DropdownMenuAction<Market>[] = [
  {
    label: 'Перейти на биржу',
    className: 'text-primary',
    click: navigateToMarket,
  },
  {
    label: 'Запустить',
    className: 'text-success',
    statement: (market: Market) => checkMarketStatus(market, 'NEW'),
    click: (market) =>
      openModalAndStoreMarket(isOpenedStartMarketConfirmation, market),
  },
  {
    label: 'Редактировать',
    click: (market) => openModalAndStoreMarket(isOpenedMarketModal, market),
  },
  {
    label: 'Завершить',
    className: 'text-danger',
    statement: (market: Market) => checkMarketStatus(market, 'ACTIVE'),
    click: (market) =>
      openModalAndStoreMarket(isOpenedFinishMarketConfirmation, market),
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: (market: Market) =>
      checkMarketStatus(market, 'NEW') || checkMarketStatus(market, 'DONE'),
    click: (market) => openModalAndStoreMarket(isOpenedDeletingMarketModal, market),
  },
]

const marketFilters: Filter<Market>[] = [
  {
    category: 'Статус',
    choices: marketStatusInfo.status.map((marketStatus) => ({
      label: marketStatusInfo.translatedStatus[marketStatus],
      value: marketStatus,
    })),
    refValue: filterByMarketStatus,
    isUniqueChoice: false,
    checkFilter: (market, filter) =>
      checkMarketStatus(market, filter as MarketStatus),
  },
]

function navigateToMarket(market: Market) {
  router.push(`/market/${market.id}`)
}
function sortByStartDate() {
  mutableSort(markets.value, (marketData: Market) =>
    new Date(marketData.startDate).getTime(),
  )
}
function sortByFinishDate() {
  mutableSort(markets.value, (marketData: Market) =>
    new Date(marketData.finishDate).getTime(),
  )
}

function getTranslatedStatus(status: MarketStatus) {
  return marketStatusInfo.translatedStatus[status]
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function openModalAndStoreMarket(refValue: Ref<boolean>, market: Market | null) {
  refValue.value = true
  if (market) {
    currentMarket.value = market
  }
}

function closeMarketModal() {
  isOpenedMarketModal.value = false
  currentMarket.value = null
}
function closeDeletingMarketModal() {
  isOpenedDeletingMarketModal.value = false
  currentMarket.value = null
}

function closeStartMarketConfirmationModal() {
  isOpenedStartMarketConfirmation.value = false
}
function closeFinishMarketConfirmationModal() {
  isOpenedFinishMarketConfirmation.value = false
}

async function handleDeleteMarket() {
  const currentUser = user.value

  if (currentUser?.token && currentMarket.value) {
    const { token } = currentUser
    const { id } = currentMarket.value

    await marketsStore.deleteMarket(id, token)
  }
}

async function handleUpdateMarketStatus(marketStatus: MarketStatus) {
  const currentUser = user.value

  if (currentUser?.token && currentMarket.value) {
    const { token } = currentUser
    const { id } = currentMarket.value

    await marketsStore.updateMarketStatus(id, marketStatus, token)
  }
}

function checkMarketStatus(market: Market, status: MarketStatus) {
  return market.status === status
}
</script>
