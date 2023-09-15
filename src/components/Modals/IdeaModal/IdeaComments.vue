<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import { string } from 'yup'
import { storeToRefs } from 'pinia'
import { vIntersectionObserver } from '@vueuse/components'

import Typography from '@Components/Typography/Typography.vue'
import { IdeaCommentsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import CommentVue from '@Components/Comment/Comment.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'

import Comment from '@Domain/Comment'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'
import useCommentsStore from '@Store/comments/commentsStore'

const props = defineProps<IdeaCommentsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const commentsStore = useCommentsStore()
const { comments, rsocketIsConnected, commentsError } = storeToRefs(commentsStore)

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

onMounted(async () => {
  if (props.idea) {
    const { id } = props.idea

    await commentsStore.connectRsocket(id)
  }
})

watch(commentsError, (error) => handleOpenNotification('error', error))

const { handleSubmit, resetForm } = useForm<Comment>({
  validationSchema: {
    comment: string().required('Поле обязательно к заполнению'),
  },
  initialValues: {
    comment: '',
  },
})

function checkIsUserComment(sender: string) {
  if (user.value?.email === sender) {
    return 'current-user-comment'
  }
}

const handleSendComment = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await commentsStore.postComment(values, id, token)

    resetForm()

    props.ideaModalRef?.scrollTo({
      top: props.ideaModalRef.scrollHeight,
      behavior: 'smooth',
    })
  }
})

const handleDeleteComment = async (commentId: string) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await commentsStore.deleteComment(commentId, id, token)
  }
}

const handleCheckComment = async (commentId: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, email } = currentUser
    await commentsStore.checkComment(email, commentId, token)
  }
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  comment: Comment,
) => {
  const currentUser = user.value

  if (
    currentUser &&
    !comment.checkedBy.includes(currentUser.email) &&
    isIntersecting
  ) {
    await handleCheckComment(comment.id)
  }
}
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="fs-6 px-3">Комментарии</Typography>
    </div>

    <IdeaCommentsPlaceholder v-if="!rsocketIsConnected" />
    <div
      v-else
      class="d-grid gap-3 pt-3 px-3 w-100"
    >
      <CommentVue
        v-for="comment in comments"
        :key="comment.id"
        :class-name="checkIsUserComment(comment.sender)"
        :comment="comment"
        v-intersection-observer="(elem) => onIntersectionObserver(elem, comment)"
        @delete-comment="handleDeleteComment(comment.id)"
      />
    </div>

    <form class="comment-form p-3">
      <Input
        name="comment"
        class-name="rounded-end"
        placeholder="Добавить комментарий"
      >
        <template #prepend>
          <i class="bi bi-chat"></i>
        </template>
      </Input>

      <Button
        type="submit"
        class-name="btn-primary"
        @click="handleSendComment"
      >
        Отправить
      </Button>
    </form>
  </div>

  <NotificationModal
    :type="notificationOptions.type"
    :is-opened="isOpenedNotification"
    @close-modal="handleCloseNotification"
    :time-expired="5000"
  >
    {{ commentsError }}
  </NotificationModal>
</template>

<style lang="scss" scoped>
.comment-form {
  @include flexible(flex-start, flex-start, $gap: 16px);
}

.current-user-comment {
  justify-self: end;
}
</style>
