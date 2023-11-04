<script lang="ts" setup>
import { onMounted, Ref, ref, VueElement } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import IdeaDescription from '@Components/Modals/IdeaModal/IdeaDescription.vue'
import IdeaComments from '@Components/Modals/IdeaModal/IdeaComments.vue'
import IdeaActions from '@Components/Modals/IdeaModal/IdeaActions.vue'
import IdeaInfo from '@Components/Modals/IdeaModal/IdeaInfo.vue'
import IdeaModalPlaceholder from '@Components/Modals/IdeaModal/IdeaModalPlaceholder.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Comment from '@Domain/Comment'

import RatingService from '@Services/RatingService'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import useCommentsStore from '@Store/comments/commentsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'

import IdeasService from '@Services/IdeasService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const idea = ref<Idea>()
const ideaSkills = ref<IdeaSkills>()

const ratings = ref<Rating[]>()
const rating = ref<Rating>()

const isOpenedIdeaModal = ref(true)

const ideasStore = useIdeasStore()
const commentsStore = useCommentsStore()

const ideaModalRef = ref<VueElement | null>(null)

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

  if (currentUser?.token) {
    const { token } = currentUser
    const id = +route.params.id

    const ideaParallelRequests = [
      () => ideasStore.getIdea(id, token),
      () => IdeasService.getIdeaSkills(id, token),
      () => RatingService.getAllIdeaRatings(id, token),
      () => commentsStore.getComments(id, token),
    ]

    await makeParallelRequests<Idea | IdeaSkills | Rating[] | Comment[] | Error>(
      ideaParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, idea)
        } else if (response.id === 1) {
          checkResponseStatus(response, ideaSkills)
        } else if (response.id === 2) {
          checkResponseStatus(response, ratings)
        }
      })
    })
  }
})

function getAccessToConfirmation() {
  if (user.value && idea.value) {
    const { id, role } = user.value
    const { status } = idea.value

    if (status === 'ON_CONFIRMATION') {
      if (role && ['EXPERT', 'ADMIN'].includes(role)) {
        const currentRating = ratings.value?.find((rating) => rating.expertId === id)

        if (currentRating) {
          rating.value = currentRating

          return currentRating
        }
      }
    }
  }
}

function handleCloseIdeaModal() {
  isOpenedIdeaModal.value = false
  router.push('/ideas/list')

  commentsStore.disconnectRsocket()
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpenedIdeaModal"
    appear-on-render
    @on-outside-close="handleCloseIdeaModal"
  >
    <div
      v-if="idea"
      class="idea-modal p-3 h-100 overflow-y-scroll"
      ref="ideaModalRef"
    >
      <div class="idea-modal__left-side w-75">
        <IdeaDescription
          :idea="idea"
          :idea-skills="ideaSkills"
          @close-modal="handleCloseIdeaModal"
        />

        <ExpertRatingCalculator
          v-if="getAccessToConfirmation()"
          :idea="idea"
          :rating="rating"
          v-model="ratings"
        />

        <IdeaActions :idea="idea" />

        <IdeaComments
          :idea="idea"
          :idea-modal-ref="ideaModalRef"
        />
      </div>

      <div class="idea-modal__right-side w-25 bg-white rounded">
        <IdeaInfo
          :idea="idea"
          :expert-ratings="ratings"
        />
      </div>
    </div>

    <IdeaModalPlaceholder v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.idea-modal {
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
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
