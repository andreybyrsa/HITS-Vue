<script lang="ts" setup>
import { onMounted, ref, Ref, VueElement } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { MarketModalProps } from '@Components/Modals/MarketModal/MarketModal.types'
import MarketDescription from '@Components/Modals/MarketModal/MarketDescription.vue'
import MarketModalPlaceholder from '@Components/Modals/MarketModal/MarketModalPlaceholder.vue'
import MarketRightSide from '@Components/Modals/MarketModal/MarketRightSide.vue'
import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'
import MarketModalTables from '@Components/Modals/MarketModal/MarketModalTables.vue'
import MarketAdvertisements from '@Components/Modals/MarketModal/MarketAdvertisements.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Team } from '@Domain/Team'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { IdeaMarket, IdeaMarketAdvertisement } from '@Domain/IdeaMarket'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'
import useIdeaMarketAdvertisementsStore from '@Store/ideaMarketAdvertisements/ideaMarketAdvertisementsStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import useCommentsStore from '@Store/comments/commentsStore'
import { Market } from '@Domain/Market'

defineProps<MarketModalProps>()

const MarketModalRef = ref<VueElement | null>(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()
const requestsToIdeaStore = useRequestsToIdeaStore()
const ideaMarketAdvertisementsStore = useIdeaMarketAdvertisementsStore()

const notificationsStore = useNotificationsStore()

const route = useRoute()
const router = useRouter()

const ideaMarket = ref<IdeaMarket>()
const requestTeams = ref<RequestTeamToIdea[]>()

const ownerTeams = ref<Team[]>()

const skillsRequestTeam = ref<RequestTeamToIdea[]>([])
const skillsAcceptedTeam = ref<Team>()

const isOpenedMarketModal = ref(true)

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role) {
    const { token, role } = currentUser
    const id = route.params.id.toString()
    const marketId = route.params.marketId.toString()

    const marketParallelRequests = [
      () => ideasMarketStore.getMarketIdea(id, marketId, role, token),
      () => requestsToIdeaStore.getRequestsToIdea(id, token),
      () => TeamService.getOwnerTeams(id, token),
      // () => MarketService.getMarket(marketId, token),
      () => ideaMarketAdvertisementsStore.getIdeaMarketAdvertisements(id, token),
    ]

    await makeParallelRequests<
      | RequestTeamToIdea[]
      | Team[]
      | Market
      | IdeaMarket
      | IdeaMarketAdvertisement[]
      | Error
    >(marketParallelRequests).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, ideaMarket)
        } else if (response.id === 1) {
          checkResponseStatus(response, requestTeams)
        } else if (response.id === 2) {
          checkResponseStatus(response, ownerTeams)
        }
      })
    })
  }
})

function closeMarketModal() {
  isOpenedMarketModal.value = false
  router.push(`/market/${route.params.marketId}`)

  useCommentsStore().disconnectRsocket()
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpenedMarketModal"
    appear-on-render
    @on-outside-close="closeMarketModal"
  >
    <div
      v-if="ideaMarket"
      ref="MarketModalRef"
      class="market-modal p-3 h-100 overflow-y-scroll"
    >
      <div class="market-modal__left-side w-75">
        <MarketDescription
          :idea-market="ideaMarket"
          @close-modal="closeMarketModal"
        />

        <MarketModalTables
          :idea-market="ideaMarket"
          :request-teams="requestTeams"
          v-model:skillsRequestTeam="skillsRequestTeam"
          v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        />

        <RequestToIdeaForm
          v-if="requestTeams && ownerTeams"
          :idea-market="ideaMarket"
          :requests="requestTeams"
          :owner-teams="ownerTeams"
          v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        />

        <MarketAdvertisements
          :idea-market="ideaMarket"
          :idea-market-modal-ref="MarketModalRef"
        />
      </div>

      <div class="market-modal__right-side w-25 rounded">
        <MarketRightSide
          :idea="ideaMarket"
          :skills="ideaMarket.stack"
          v-model:skillsRequestTeam="skillsRequestTeam"
          v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        />
      </div>
    </div>

    <MarketModalPlaceholder v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.market-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);

    &-block {
      @include flexible(center, center);
      width: 100%;
      height: 500px;
    }
  }

  &__right-side {
    height: fit-content;
    overflow: hidden;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .market-modal,
.modal-layout-leave-to .market-modal {
  transform: translateX(100%);
}
</style>
