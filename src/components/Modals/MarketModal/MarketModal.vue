<script lang="ts" setup>
import { onMounted, ref, Ref, VueElement } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { MarketModalProps } from '@Components/Modals/MarketModal/MarketModal.types'

import IdeaComments from '@Components/Modals/IdeaModal/IdeaComments.vue'
import MarketDescription from '@Components/Modals/MarketModal/MarketDescription.vue'
import MarketAcceptTeam from '@Components/Modals/MarketModal/MarketAcceptTeam.vue'
import MarketPlaceholder from '@Components/Modals/MarketModal/MarketPlaceholder.vue'
import MarketRightSide from '@Components/Modals/MarketModal/MarketRightSide.vue'

import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'
import ReviewIdeaRequestsForm from '@Components/Forms/ReviewIdeaRequestsForm/ReviewIdeaRequestsForm.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'
import TeamService from '@Services/TeamService'
import IdeasMarketService from '@Services/IdeasMarketService'
import RequestTeamsServise from '@Services/RequestTeamsServise'
import useCommentsStore from '@Store/comments/commentsStore'

import Team from '@Domain/Team'
import Comment from '@Domain/Comment'
import RequestTeams from '@Domain/RequestTeams'
import IdeasMarket from '@Domain/IdeasMarket'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'

defineProps<MarketModalProps>()

const MarketModalRef = ref<VueElement | null>(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const idea = ref<IdeasMarket>()
const requestTeams = ref<RequestTeams[]>()
const teams = ref<Team[]>()
const skillsRequestTeam = ref<RequestTeams[]>()
const skillsTeam = ref<Team[]>([])

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    // notification
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const id = route.params.id.toString()

    const marketParallelRequests = [
      () => IdeasMarketService.getIdeaMarket(id, token),
      () => RequestTeamsServise.getRequestAll(id, token),
      () => TeamService.getTeams(token),
      () => useCommentsStore().getComments(id, token),
    ]

    await makeParallelRequests<
      RequestTeams[] | Team[] | IdeasMarket | Comment[] | Error
    >(marketParallelRequests).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, idea)
        } else if (response.id === 1) {
          checkResponseStatus(response, requestTeams)
        } else if (response.id === 2) {
          checkResponseStatus(response, teams)
        }
      })
    })
  }
})

const isOpenedMarketModal = ref(true)

function closeMarketModal() {
  isOpenedMarketModal.value = false
  router.push('/market')

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
      v-if="idea && requestTeams && teams"
      ref="MarketModalRef"
      class="market-modal p-3 h-100 overflow-y-scroll"
    >
      <div class="market-modal__left-side w-75">
        <MarketDescription
          :idea="idea"
          @close-modal="closeMarketModal"
        />

        <ReviewIdeaRequestsForm
          :idea="idea"
          v-model:requestTeams="requestTeams"
          v-model:skillsRequestTeam="skillsRequestTeam"
        />

        <RequestToIdeaForm
          v-model:teams="teams"
          :idea="idea"
          v-model:requestTeams="requestTeams"
          v-model:skillsTeam="skillsTeam"
        />

        <IdeaComments
          :news="user.id === idea.id"
          :idea="idea"
          :idea-modal-ref="MarketModalRef"
        />
      </div>

      <div class="market-modal__right-side w-25 rounded">
        <MarketRightSide
          :idea="idea"
          :skills="idea.stack"
          v-model:skillsRequestTeam="skillsRequestTeam"
          v-model:skillsTeam="skillsTeam"
        />

        <MarketAcceptTeam
          v-model="requestTeams"
          :idea="idea"
        />
      </div>
    </div>
    <MarketPlaceholder v-else />
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

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .market-modal,
.modal-layout-leave-to .market-modal {
  transform: translateX(100%);
}
</style>
