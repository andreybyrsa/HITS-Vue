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

import { Idea, Rating } from '@Domain/Idea'
import Comment from '@Domain/Comment'

import IdeasService from '@Services/IdeasService'
import CommentService from '@Services/CommentService'
import RatingService from '@Services/RatingService'

import useCommentsStore from '@Store/comments/commentsStore'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const idea = ref<Idea>()
const comments = ref<Comment[]>()
const ratings = ref<Rating[]>()
const rating = ref<Rating>()

const isOpenedIdeaModal = ref(true)

const commentStore = useCommentsStore()
const { rsocketIsConnected, closeRsocket } = storeToRefs(commentStore)

const ideaModalRef = ref<VueElement | null>(null)

function checkResponseStatus<T>(
  data: PromiseSettledResult<T>,
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
    const { token, role } = currentUser
    const id = route.params.id.toString()

    const ideaParallelRequests: (
      | Promise<Error | Comment[]>
      | Promise<Error | Idea>
      | Promise<Error | Rating[]>
      | Promise<Error | Rating>
    )[] = [
      IdeasService.getIdea(id, token),
      CommentService.fetchComments(id, token),
      RatingService.getAllIdeaRatings(id, token),
    ]

    if (role && ['EXPERT', 'ADMIN'].includes(role)) {
      ideaParallelRequests.push(RatingService.getExpertRating(id, token))
    }

    await Promise.allSettled(ideaParallelRequests).then((responses) => {
      responses.forEach((response, index) => {
        if (index === 0) {
          checkResponseStatus(response, idea)
        } else if (index === 1) {
          checkResponseStatus(response, comments)
        } else if (index === 2) {
          checkResponseStatus(response, ratings)
        } else if (index === 3) {
          checkResponseStatus(response, rating)
        }
      })
    })
  }
})

function getAccessToConfirmation() {
  if (user.value && idea.value) {
    const { email, role } = user.value
    const { status } = idea.value

    if (status === 'ON_CONFIRMATION') {
      if (role && ['EXPERT', 'ADMIN'].includes(role)) {
        const isExistRating = ratings.value?.find(
          (rating) => rating.expert === email,
        )

        return isExistRating
      }
    }
  }
}

function handleCloseIdeaModal() {
  isOpenedIdeaModal.value = false
  router.go(-1)

  if (rsocketIsConnected.value) {
    closeRsocket.value()
  }
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
          @close-modal="handleCloseIdeaModal"
        />

        <ExpertRatingCalculator
          v-if="getAccessToConfirmation()"
          :idea="idea"
          :rating="rating"
          v-model="ratings"
        />

        <IdeaActions v-model="idea" />

        <IdeaComments
          :idea="idea"
          :comments="comments"
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
