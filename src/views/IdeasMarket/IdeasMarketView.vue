<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import RequestToIdeaModal from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import IdeaCardsPlaceholder from '@Views/IdeasMarket/IdeaCardsPlaceholder.vue'
import IdeaCard from '@Views/IdeasMarket/IdeaCard.vue'

import { IdeaMarket, IdeaMarketStatusType } from '@Domain/IdeaMarket'

import IdeasMarketService from '@Services/IdeasMarketService'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import MarketService from '@Services/MarketService'
import { Market } from '@Domain/Market'
import { useRoute } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import ReturnIdeasMarketModal from '@Components/Modals/ReturnIdeasMarketModal/ReturnIdeasMarketModal.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import getIdeaMarketStatus from '@Utils/ideaMarketStatus'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const availableStatus = getIdeaMarketStatus()

const ideasMarketStore = useIdeasMarketStore()

const filterByIdeaMarketStatus = ref<IdeaMarketStatusType>()

const notificationsStore = useNotificationsStore()

const ideas = ref<IdeaMarket[]>([])
const market = ref<Market>()
const isAllIdeas = ref(true)

const route = useRoute()

const searchedValue = ref('')

const ideaMarket = ref<IdeaMarket | null>(null)
const isOpenedRequestToIdeaModal = ref(false)
const isOpenedSendToNextMarketModal = ref(false)

const openIdeasMarket = computed(() =>
  ideas.value.filter(({ status }) => status === 'RECRUITMENT_IS_OPEN'),
)

const searchedIdeas = computed(() => {
  if (filterByIdeaMarketStatus.value) {
    return ideas.value.filter(
      ({ status }) => status === filterByIdeaMarketStatus.value,
    )
  }

  if (!searchedValue.value) {
    return ideas.value
  }

  const lowercaseSearch = searchedValue.value.toLowerCase().trim()
  return ideas.value?.filter((idea) => {
    const ideaName = idea.name.toLocaleLowerCase().trim()
    return ideaName.includes(lowercaseSearch)
  })
})

const ideasMarketFilters: Filter<IdeaMarket>[] = [
  {
    category: 'Статус',
    choices: availableStatus.status.map((IdeasMarketStatus) => ({
      label: availableStatus.translatedStatus[IdeasMarketStatus],
      value: IdeasMarketStatus,
    })),
    refValue: filterByIdeaMarketStatus,
    isUniqueChoice: true,
    checkFilter: checkIdeaMarketStatus,
  },
]

onMounted(async () => getIdeasByRole())

watch(
  () => user.value?.role && route.params,
  async () => {
    if (isAllIdeas.value) getIdeasByRole()
  },
)

async function getIdeasByRole() {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role) {
    const { token, role } = currentUser
    const marketId = route.params.marketId.toString()

    ideas.value = []

    const responseMarket = await MarketService.getMarket(marketId, token)
    if (responseMarket instanceof Error) {
      return useNotificationsStore().createSystemNotification(
        'Система',
        responseMarket.message,
      )
    }
    market.value = responseMarket

    const responseIdeas = await ideasMarketStore.getMarketIdeas(
      marketId.toString(),
      role,
      token,
    )
    if (responseIdeas instanceof Error) {
      return
    }

    ideas.value = responseIdeas
  }
}

async function getFavoritesIdeas() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const marketId = route.params.marketId.toString()

    ideas.value = []
    const response = await IdeasMarketService.fetchFavoritesIdeas(marketId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideas.value = response
  }
}

function getNavTabClass(isAllIdeas: boolean) {
  const initialClass = ['nav-link', 'header-link']
  if (isAllIdeas) {
    initialClass.push('active', 'text-primary')
    return initialClass
  }
  initialClass.push('text-dark')
  return initialClass
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

function openReturnIdeasMarketModal() {
  isOpenedSendToNextMarketModal.value = true
}

function closeReturnIdeasMarketModal() {
  isOpenedSendToNextMarketModal.value = false
}

function checkIdeaMarketStatus(ideaMarket: IdeaMarket, status: FilterValue) {
  return ideaMarket.status === status
}

function getAccessToCloseMarket() {
  const role = user.value?.role
  const marketStatus = market.value?.status
  return (role === 'ADMIN' || role === 'PROJECT_OFFICE') && marketStatus === 'ACTIVE'
}
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="market-page__content p-3 bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-75">{{ market?.name }}</Typography>

      <div class="market-page__navigation nav nav-underline mb-3">
        <div
          :class="getNavTabClass(isAllIdeas === true)"
          @click="switchNavTab(true, getIdeasByRole)"
        >
          Все
        </div>
        <div
          :class="getNavTabClass(isAllIdeas === false)"
          @click="switchNavTab(false, getFavoritesIdeas)"
        >
          Избранное
        </div>
      </div>

      <div class="search-and-close-market mb-3 w-100">
        <div class="w-50">
          <Input
            name="search"
            class-name="rounded-end"
            no-form-controlled
            v-model="searchedValue"
            placeholder="Поиск"
          >
            <template #prepend>
              <Icon class-name="bi bi-search" />
            </template>
          </Input>
        </div>
        <div>
          <Button
            v-if="getAccessToCloseMarket()"
            variant="danger"
            @click="openReturnIdeasMarketModal"
            >Закрыть биржу
          </Button>
        </div>
      </div>

      <div class="idea-cards-filter">
        <div class="idea-cards row">
          <template v-if="searchedIdeas && market">
            <IdeaCard
              v-for="idea in searchedIdeas"
              :key="idea.id"
              :idea="idea"
              :is-all-ideas="isAllIdeas"
              :market="market"
              v-model:ideas="searchedIdeas"
              @send-quick-request="openRequestToIdeaModal"
            />
          </template>

          <IdeaCardsPlaceholder v-else />
        </div>

        <FilterBar
          v-if="ideasMarketFilters"
          class-name="ms-2 border-start h-100"
          :filters="ideasMarketFilters"
        />
      </div>

      <RequestToIdeaModal
        :idea-market="ideaMarket"
        :is-opened="isOpenedRequestToIdeaModal"
        @close-modal="closeRequestToIdeaModal"
      />

      <ReturnIdeasMarketModal
        v-if="market"
        :ideasMarket="openIdeasMarket"
        :market="market"
        :is-opened="isOpenedSendToNextMarketModal"
        @close-modal="closeReturnIdeasMarketModal"
      />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.header-link {
  cursor: pointer;
}

.market-page {
  &__navigation {
    @include flexible(none, center, $gap: 16px);
  }

  &__content {
    overflow-y: scroll;
    @include flexible(stretch, flex-start, column);
  }
}

.idea-cards {
  width: 100%;
  grid-row-gap: 20px;
}

.idea-cards-filter {
  @include flexible(stretch, flex-start, $gap: 8px);
}

.search-and-close-market {
  @include flexible(center, space-between, $gap: 8px);
}
</style>
