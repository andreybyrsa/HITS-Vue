<script lang="ts" setup>
import { ref, onMounted, VueElement } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import IdeaDescription from '@Components/Modals/IdeaModal/IdeaDescription.vue'
import IdeaComments from '@Components/Modals/IdeaModal/IdeaComments.vue'
import IdeaActions from '@Components/Modals/IdeaModal/IdeaActions.vue'
import IdeaInfo from '@Components/Modals/IdeaModal/IdeaInfo.vue'
import IdeaModalPlaceholder from '@Components/Modals/IdeaModal/IdeaModalPlaceholder.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import { IdeaModalProps } from '@Components/Modals/IdeaModal/IdeaModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Comment from '@Domain/Comment'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import useRatingsStore from '@Store/ratings/ratingsStore'
import useCommentsStore from '@Store/comments/commentsStore'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const props = defineProps<IdeaModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const idea = ref<Idea>()
const ideaSkills = ref<IdeaSkills>()
const ratings = ref<Rating[]>()
const comments = ref<Comment[]>()

const isOpenedIdeaModal = ref(true)

const ideasStore = useIdeasStore()
const ratingsStore = useRatingsStore()
const commentsStore = useCommentsStore()

const ideaModalRef = ref<VueElement | null>(null)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentUser?.role) {
    const { token, role } = currentUser
    const id = route.params.id.toString()

    const ideaParallelRequests: RequestConfig[] = [
      {
        request: () => ideasStore.getIdea(id, role, token),
        refValue: idea,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => IdeasService.getIdeaSkills(id, token),
        refValue: ideaSkills,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => ratingsStore.getIdeaRatings(id, token),
        refValue: ratings,
        statement:
          role === 'EXPERT' || role === 'PROJECT_OFFICE' || role === 'ADMIN',
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => commentsStore.getComments(id, token),
        refValue: comments,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(ideaParallelRequests)

    ideasStore.checkIdea(id)
  }
})

const rating = ref()
function getAccessToConfirmation() {
  if (user.value && idea.value) {
    const { id, role } = user.value
    const { status } = idea.value

    if (status === 'ON_CONFIRMATION') {
      if (role && ['EXPERT', 'ADMIN'].includes(role)) {
        rating.value = ratings.value?.find((rating) => rating.expertId === id)
        return ratings.value?.find((rating) => rating.expertId === id)
      }
    }
  }
}

function handleCloseIdeaModal() {
  isOpenedIdeaModal.value = false
  commentsStore.disconnectRsocket()

  if (props.canGoBack) {
    return router.go(-1)
  }

  router.push({ name: 'ideas-list' })
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
