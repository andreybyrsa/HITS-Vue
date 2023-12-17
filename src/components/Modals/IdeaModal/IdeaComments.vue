<script lang="ts" setup>
import { vIntersectionObserver } from '@vueuse/components'
import { storeToRefs } from 'pinia'

import { IdeaCommentsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import AdvertisementsForm from '@Components/Forms/AdvertisementsForm/AdvertisementsForm.vue'
import Advertisement from '@Components/Advertisement/Advertisement.vue'
import { Action } from '@Components/ActionsList/ActionsList.types'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'

import Comment from '@Domain/Comment'

import useUserStore from '@Store/user/userStore'
import useCommentsStore from '@Store/comments/commentsStore'

const props = defineProps<IdeaCommentsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const commentsStore = useCommentsStore()
const { comments } = storeToRefs(commentsStore)

const commentFormInitialState = {
  ideaId: props.idea.id,
  text: '',
  senderEmail: user.value?.email,
  checkedBy: user.value ? [user.value.email] : [],
} as Comment

const commentDropdownActions: Action<Comment>[] = [
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkCommentOwned,
    click: handleDeleteComment,
  },
]

async function handleSendComment(values: Comment) {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    await commentsStore.createComment(values, token)

    props.ideaModalRef?.scrollTo({
      top: props.ideaModalRef.scrollHeight,
      behavior: 'smooth',
    })
  }
}

async function handleDeleteComment(comment?: Comment) {
  const currentUser = user.value

  if (currentUser?.token && comment) {
    const { token } = currentUser
    const { id } = comment
    await commentsStore.deleteComment(id, token)
  }
}

const handleCheckComment = async (commentId: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, email } = currentUser
    await commentsStore.checkComment(commentId, email, token)
  }
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  comment: Comment,
) => {
  if (user.value) {
    const { email } = user.value

    if (!comment.checkedBy.includes(email) && isIntersecting) {
      await handleCheckComment(comment.id)
    }
  }
}

function checkIsUserComment(senderEmail: string) {
  if (user.value?.email === senderEmail) {
    return 'current-user-comment'
  }
}

function checkIsActiveComment(comment: Comment) {
  const { checkedBy } = comment
  const currentUser = user.value

  return currentUser && checkedBy.includes(currentUser.email) ? false : true
}

function checkCommentOwned(comment: Comment) {
  return comment.senderEmail === user.value?.email
}
</script>

<template>
  <AdvertisementsForm
    title="Комментарии"
    input-placeholder="Добавить комментарий"
    :initial-state="commentFormInitialState"
    :handle-send-advertisement="handleSendComment"
    has-access-to-send
  >
    <template #content>
      <template v-if="comments">
        <Advertisement
          v-for="comment in comments"
          :key="comment.id"
          :class-name="checkIsUserComment(comment.senderEmail)"
          :advertisement="comment"
          :text="comment.text"
          :sender="comment.senderEmail"
          :created-at="comment.createdAt"
          :is-active="checkIsActiveComment(comment)"
          :has-access-to-actions="checkCommentOwned(comment)"
          :dropdown-actions="commentDropdownActions"
          v-intersection-observer="(elem) => onIntersectionObserver(elem, comment)"
        />
      </template>

      <IdeaCommentsPlaceholder v-else />
    </template>
  </AdvertisementsForm>
</template>

<style lang="scss" scoped>
.current-user-comment {
  justify-self: end;
}
</style>
