<script lang="ts" setup>
import { vIntersectionObserver } from '@vueuse/components'
import { storeToRefs } from 'pinia'
import { Comment } from '@Domain'
import { useUserStore, useCommentsStore } from '@Store'
import { Action } from '@Components/ActionsList/ActionsList.types'
import { IdeaCommentsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import AdvertisementsForm from '@Components/Forms/AdvertisementsForm/AdvertisementsForm.vue'
import Advertisement from '@Components/Advertisement/Advertisement.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'

const props = defineProps<IdeaCommentsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const commentsStore = useCommentsStore()
const { comments } = storeToRefs(commentsStore)

const commentFormInitialState = {
  ideaId: props.idea.id,
  text: '',
  sender: user.value ? user.value : {},
  checkedBy: user.value ? [user.value.id] : [],
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
  if (props.idea) {
    await commentsStore.createComment(values)

    props.ideaModalRef?.scrollTo({
      top: props.ideaModalRef.scrollHeight,
      behavior: 'smooth',
    })
  }
}

async function handleDeleteComment(comment?: Comment) {
  if (comment) {
    const { id } = comment
    await commentsStore.deleteComment(id)
  }
}

const handleCheckComment = async (commentId: string) => {
  const currentUser = user.value

  if (currentUser) {
    const { id } = currentUser
    await commentsStore.checkComment(commentId, id)
  }
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  comment: Comment,
) => {
  if (user.value) {
    const { id } = user.value

    if (!comment.checkedBy.includes(id) && isIntersecting) {
      await handleCheckComment(comment.id)
    }
  }
}

function checkIsActiveComment(comment: Comment) {
  const { checkedBy } = comment
  const currentUser = user.value

  return currentUser && checkedBy.includes(currentUser.id) ? false : true
}

function checkCommentOwned(comment: Comment) {
  const { sender } = comment
  return sender.email === user.value?.email
}

function getCommentSender(comment: Comment) {
  const { sender } = comment
  return `${sender.firstName} ${sender.lastName}`
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
          :class-name="checkCommentOwned(comment) ? 'current-user-comment' : ''"
          :advertisement="comment"
          :text="comment.text"
          :sender="getCommentSender(comment)"
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
