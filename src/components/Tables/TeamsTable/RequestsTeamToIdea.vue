<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { JoinStatus, RequestTeamToIdea } from '@Domain'
import { getJoinStatus, getJoinStatusStyle, navigateToAliasRoute } from '@Utils'
import { RequestsTeamToIdeasProps } from '@Components/Modals/TeamModal/TeamModal.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import LetterModal from '@Components/Modals/LetterModal/LetterModal.vue'
import IdeaMarketModal from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.vue'

defineProps<RequestsTeamToIdeasProps>()

const requestsToTeamStatus = getJoinStatus()

const letterCurrentTeam = ref('')
const isOpenedLetterModal = ref(false)

const requestToTeamColumns: TableColumn<RequestTeamToIdea>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-7',
    rowCellClick: navigateToIdeaMarket,
  },
  {
    key: 'status',
    label: 'Статус',
    size: 'col-4',
    contentClassName: 'justify-content-center text-center h-100',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getJoinStatusStyle,
  },
]

const dropdownRequestToTeamActions: DropdownMenuAction<RequestTeamToIdea>[] = [
  { label: 'Открыть идею', click: navigateToIdeaMarket },
  { label: 'Просмотреть письмо', click: openLetterModal },
]

function navigateToIdeaMarket(request: RequestTeamToIdea) {
  const ideaMarketRoute: RouteRecordRaw = {
    name: 'market-idea-modal',
    path: 'market/:marketId/:ideaMarketId',
    alias: '/market/:marketId/:ideaMarketId',
    component: IdeaMarketModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(
    'teams-list',
    `/market/${request.marketId}/${request.ideaMarketId}`,
    ideaMarketRoute,
  )
}

function openLetterModal(request: RequestTeamToIdea) {
  const { letter } = request
  letterCurrentTeam.value = letter
  isOpenedLetterModal.value = true
}

function closeLetterModal() {
  isOpenedLetterModal.value = false
}

function getStatusFormat(status: JoinStatus) {
  return requestsToTeamStatus.translatedRequests[status]
}
</script>

<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="requests"
    :columns="requestToTeamColumns"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownRequestToTeamActions"
  />

  <LetterModal
    :is-opened="isOpenedLetterModal"
    :letter="letterCurrentTeam"
    @close-modal="closeLetterModal"
  />
</template>
