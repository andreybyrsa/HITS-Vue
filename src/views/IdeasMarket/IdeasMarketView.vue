<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import RequestToIdeaModal from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import IdeaMarketCard from '@Views/IdeasMarket/IdeaMarketCard.vue'
import IdeaMarketCardsPlaceholder from '@Views/IdeasMarket/IdeaMarketCardsPlaceholder.vue'
import IdeasMarketHeader from '@Views/IdeasMarket/IdeasMarketHeader.vue'

import { IdeaMarket, IdeaMarketStatusType } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

import IdeasMarketService from '@Services/IdeasMarketService'
import MarketService from '@Services/MarketService'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import getIdeaMarketStatus from '@Utils/ideaMarketStatus'
import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const notificationsStore = useNotificationsStore()

const route = useRoute()

const ideasMarket = ref<IdeaMarket[] | null>(null)
const market = ref<Market | null>(null)
const ideaMarket = ref<IdeaMarket | null>(null)

const availableStatus = getIdeaMarketStatus()

const searchedValue = ref('')
const filterByIdeaMarketStatus = ref<IdeaMarketStatusType>()

const isAllIdeas = ref(true)
const isOpenedRequestToIdeaModal = ref(false)

onMounted(getIdeasMarket)

watch(
  () => user.value?.role,
  async () => {
    if (isAllIdeas.value) {
      return await getIdeasMarket()
    }
  },
)

async function getIdeasMarket() {
  const currentUser = user.value

  if (currentUser?.token && currentUser?.role) {
    const { token, role } = currentUser
    const marketId = route.params.marketId.toString()

    ideasMarket.value = null
    market.value = null

    const ideasMarketParallelRequests: RequestConfig[] = [
      {
        request: () => ideasMarketStore.getMarketIdeas(marketId, role, token),
        refValue: ideasMarket,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => MarketService.getMarket(marketId, token),
        refValue: market,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(ideasMarketParallelRequests)
  }
}

async function getFavoriteIdeasMarket() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const marketId = route.params.marketId.toString()

    ideasMarket.value = null
    const response = await IdeasMarketService.fetchFavoritesIdeas(marketId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideasMarket.value = response
  }
}

const searchedIdeas = computed(() => {
  if (searchedValue.value) {
    const lowercaseSearch = searchedValue.value.toLowerCase().trim()

    return ideasMarket.value?.filter((idea) => {
      const ideaName = idea.name.toLowerCase().trim()

      const isMatchedToFilter = filterByIdeaMarketStatus.value
        ? checkIdeaMarketStatus(idea, filterByIdeaMarketStatus.value)
        : true

      return ideaName.includes(lowercaseSearch) && isMatchedToFilter
    })
  }

  return ideasMarket.value
})

const ideasMarketFilters: Filter<IdeaMarket>[] = [
  {
    category: 'Статус идеи',
    choices: availableStatus.status.map((IdeasMarketStatus) => ({
      label: availableStatus.translatedStatus[IdeasMarketStatus],
      value: IdeasMarketStatus,
    })),
    refValue: filterByIdeaMarketStatus,
    isUniqueChoice: true,
    checkFilter: checkIdeaMarketStatus,
  },
]

function checkIdeaMarketStatus(ideaMarket: IdeaMarket, status: FilterValue) {
  return ideaMarket.status === status
}

async function switchNavTab(value: boolean, callback: () => Promise<void>) {
  await callback()
  isAllIdeas.value = value
}

function openRequestToIdeaModal(idea: IdeaMarket) {
  ideaMarket.value = idea
  isOpenedRequestToIdeaModal.value = true
}
function closeRequestToIdeaModal() {
  ideaMarket.value = null
  isOpenedRequestToIdeaModal.value = false
}
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="ideas-market-view__content p-3 bg-white"
  >
    <template #header>
      <Header></Header>
    </template>

    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <IdeasMarketHeader
        :market="market"
        :is-all-ideas="isAllIdeas"
        v-model="searchedValue"
        @switch-to-all="switchNavTab(true, getIdeasMarket)"
        @switch-to-favourites="switchNavTab(false, getFavoriteIdeasMarket)"
      />

      <div class="w-100 d-flex justify-content-stretch align-items-start">
        <div class="w-100 d-grid">
          <div class="row g-3 row-cols-1 row-cols-sm-1 row-cols-lg-2">
            <template v-if="searchedIdeas">
              <IdeaMarketCard
                v-for="idea in searchedIdeas"
                :key="idea.id"
                :idea-market="idea"
                :is-all-ideas="isAllIdeas"
                v-model:ideas="searchedIdeas"
                @send-quick-request="openRequestToIdeaModal"
              />
            </template>

            <IdeaMarketCardsPlaceholder v-else />
          </div>
        </div>

        <FilterBar
          class-name="ms-3 border-start"
          :filters="ideasMarketFilters"
        />
      </div>

      <RequestToIdeaModal
        :idea-market="ideaMarket"
        :is-opened="isOpenedRequestToIdeaModal"
        @close-modal="closeRequestToIdeaModal"
      />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-market-view {
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
