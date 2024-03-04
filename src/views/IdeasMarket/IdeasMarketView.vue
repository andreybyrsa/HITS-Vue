<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { Profile, Skill, Market, IdeaMarket, IdeaMarketStatusType } from '@Domain'
import {
  useProfilesStore,
  useUserStore,
  useIdeasMarketStore,
  useNotificationsStore,
} from '@Store'
import { SkillsService, IdeaMarketService, MarketService } from '@Service'
import {
  getIdeaMarketStatus,
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import RequestToIdeaModal from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import IdeaMarketCard from '@Views/IdeasMarket/IdeaMarketCard.vue'
import IdeaMarketCardsPlaceholder from '@Views/IdeasMarket/IdeaMarketCardsPlaceholder.vue'
import IdeasMarketHeader from '@Views/IdeasMarket/IdeasMarketHeader.vue'

const profilesStore = useProfilesStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const notificationsStore = useNotificationsStore()

const route = useRoute()

const ideasMarket = ref<IdeaMarket[] | null>(null)
const market = ref<Market | null>(null)
const ideaMarket = ref<IdeaMarket | null>(null)
const profile = ref<Profile>()
const skills = ref<Skill[]>()

const availableStatus = getIdeaMarketStatus()

const searchedValue = ref('')
const filterByIdeaMarketStatus = ref<IdeaMarketStatusType>()
const filterByIdeaMarketSkill = ref<string[]>([])
const searchBySkills = ref('')

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

  if (currentUser?.role) {
    const { role, id } = currentUser
    const marketId = route.params.marketId.toString()

    ideasMarket.value = null
    market.value = null

    const ideasMarketParallelRequests: RequestConfig[] = [
      {
        request: () => ideasMarketStore.getMarketIdeas(marketId, role),
        refValue: ideasMarket,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => SkillsService.getAllSkills(),
        refValue: skills,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => MarketService.getMarket(marketId),
        refValue: market,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => profilesStore.fetchUserProfile(id),
        refValue: profile,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(ideasMarketParallelRequests)
  }
}

async function getFavoriteIdeasMarket() {
  const marketId = route.params.marketId.toString()

  ideasMarket.value = null
  const response = await IdeaMarketService.fetchFavoritesIdeas(marketId)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  ideasMarket.value = response
}

const searchedIdeas = computed(() => {
  if (filterByIdeaMarketSkill.value.length && filterByIdeaMarketStatus.value) {
    return ideasMarket.value?.filter(
      ({ status, stack }) =>
        filterByIdeaMarketStatus.value?.includes(status) &&
        stack.find(({ name }) => filterByIdeaMarketSkill.value.includes(name)),
    )
  }

  if (filterByIdeaMarketStatus.value) {
    return ideasMarket.value?.filter(({ status }) =>
      filterByIdeaMarketStatus.value?.includes(status),
    )
  }

  if (filterByIdeaMarketSkill.value.length) {
    return ideasMarket.value?.filter(({ stack }) =>
      stack.find(({ name }) => filterByIdeaMarketSkill.value.includes(name)),
    )
  }

  if (searchedValue.value) {
    const lowercaseSearch = searchedValue.value.toLowerCase().trim()

    return ideasMarket.value?.filter((idea) => {
      const ideaName = idea.name.toLowerCase().trim()
      const ideaInitiatorFirstName = idea.initiator.firstName.toLowerCase().trim()
      const ideaInitiatorLastName = idea.initiator.lastName.toLowerCase().trim()

      return (
        ideaName.includes(lowercaseSearch) ||
        ideaInitiatorFirstName.includes(lowercaseSearch) ||
        ideaInitiatorLastName.includes(lowercaseSearch)
      )
    })
  }

  return ideasMarket.value
})

const ideasMarketFilters = computed<Filter<IdeaMarket>[]>(() => [
  {
    category: 'Статус идеи',
    choices: availableStatus.status.map((IdeasMarketStatus) => ({
      label: availableStatus.translatedStatus[IdeasMarketStatus],
      value: IdeasMarketStatus,
    })),
    refValue: filterByIdeaMarketStatus,
    isUniqueChoice: true,
    checkFilter: () => null,
  },
  {
    category: 'Компетенции',
    searchValue: searchBySkills,
    choices: getFilterSkills(),
    refValue: filterByIdeaMarketSkill,
    isUniqueChoice: false,
    checkFilter: () => null,
  },
])

function getFilterSkills() {
  return skills.value
    ? skills.value
        .map(({ name }) => ({
          label: name,
          value: name,
          isMarked: !!profile.value?.skills.find((skill) => skill.name === name),
        }))
        .sort((a, b) => +b.isMarked - +a.isMarked)
    : []
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
