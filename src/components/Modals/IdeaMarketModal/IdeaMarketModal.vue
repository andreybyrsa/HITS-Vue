<script lang="ts" setup>
import { onMounted, ref, Ref, VueElement } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { IdeaMarketModalProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import IdeaMarketDescription from '@Components/Modals/IdeaMarketModal/IdeaMarketDescription.vue'
import IdeaMarketModalPlaceholder from '@Components/Modals/IdeaMarketModal/IdeaMarketModalPlaceholder.vue'
import IdeaMarketRightSide from '@Components/Modals/IdeaMarketModal/IdeaMarketRightSide.vue'
import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'
import IdeaMarketModalTables from '@Components/Modals/IdeaMarketModal/IdeaMarketModalTables.vue'
import IdeaMarketAdverts from '@Components/Modals/IdeaMarketModal/IdeaMarketAdverts.vue'

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

defineProps<IdeaMarketModalProps>()

const IdeaMarketModalRef = ref<VueElement | null>(null)

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
    const { token, id: userId, role } = currentUser
    const id = route.params.id.toString()

    const marketParallelRequests = [
      () => ideasMarketStore.getMarketIdea(id, role, token),
      () => requestsToIdeaStore.getRequestsToIdea(id, token),
      () => TeamService.getOwnerTeams(userId, token),
      () => ideaMarketAdvertisementsStore.getIdeaMarketAdvertisements(id, token),
    ]

    await makeParallelRequests<
      RequestTeamToIdea[] | Team[] | IdeaMarket | IdeaMarketAdvertisement[] | Error
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
  router.push('/market')
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
      ref="IdeaMarketModalRef"
      class="idea-market-modal p-3 h-100 overflow-y-scroll"
    >
      <div class="idea-market-modal__left-side w-75">
        <IdeaMarketDescription
          :idea-market="ideaMarket"
          @close-modal="closeMarketModal"
        />

        <IdeaMarketModalTables
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
        />

        <IdeaMarketAdverts
          :idea-market="ideaMarket"
          :idea-market-modal-ref="IdeaMarketModalRef"
        />
      </div>

      <div class="market-modal__right-side w-25 rounded">
        <IdeaMarketRightSide
          :idea="ideaMarket"
          :skills="ideaMarket.stack"
          v-model:skillsRequestTeam="skillsRequestTeam"
          v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        />
      </div>
    </div>

    <IdeaMarketModalPlaceholder v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.idea-market-modal {
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
