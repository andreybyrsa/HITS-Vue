<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { string } from 'yup'
import { storeToRefs } from 'pinia'
import { vIntersectionObserver } from '@vueuse/components'

import Typography from '@Components/Typography/Typography.vue'
import { IdeaCommentsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import CommentVue from '@Components/Comment/Comment.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'

import Comment from '@Domain/Comment'

import useUserStore from '@Store/user/userStore'
import useCommentsStore from '@Store/comments/commentsStore'

const props = defineProps<IdeaCommentsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const commentsStore = useCommentsStore()
const { comments } = storeToRefs(commentsStore)

const { handleSubmit, resetForm } = useForm<Comment>({
  validationSchema: {
    text: string().required('Поле обязательно к заполнению'),
  },
  initialValues: {
    ideaId: props.idea.id,
    text: '',
    senderEmail: user.value?.email,
    checkedBy: user.value ? [user.value.id] : [],
  },
})

function checkIsUserComment(senderEmail: string) {
  if (user.value?.email === senderEmail) {
    return 'current-user-comment'
  }
}

const handleSendComment = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    await commentsStore.createComment(values, token)

    resetForm()

    props.ideaModalRef?.scrollTo({
      top: props.ideaModalRef.scrollHeight,
      behavior: 'smooth',
    })
  }
})

const handleDeleteComment = async (commentId: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await commentsStore.deleteComment(commentId, token)
  }
}

const handleCheckComment = async (commentId: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id } = currentUser
    await commentsStore.checkComment(id, commentId, token)
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
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="fs-6 px-3">Комментарии</Typography>
    </div>

    <div
      v-if="comments"
      class="d-grid gap-3 pt-3 px-3 w-100"
    >
      <CommentVue
        v-for="comment in comments"
        :key="comment.id"
        :class-name="checkIsUserComment(comment.senderEmail)"
        :comment="comment"
        v-intersection-observer="(elem) => onIntersectionObserver(elem, comment)"
        @delete-comment="handleDeleteComment(comment.id)"
      />
    </div>
    <IdeaCommentsPlaceholder v-else />

    <form class="comment-form p-3">
      <Input
        name="text"
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
</template>

<style lang="scss" scoped>
.comment-form {
  @include flexible(flex-start, flex-start, $gap: 16px);
}

.current-user-comment {
  justify-self: end;
}
</style>
