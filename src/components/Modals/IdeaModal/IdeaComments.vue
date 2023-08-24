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

import Comment from '@Domain/Comment'

import useUserStore from '@Store/user/userStore'

const props = defineProps<IdeaCommentsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { handleSubmit, resetForm } = useForm<Comment>({
  validationSchema: {
    comment: string().required('Поле обязательно к заполнению'),
  },
  initialValues: {
    comment: '',
    sender: user.value?.email,
    checkedBy: [`${user.value?.email}`],
  },
})

function checkIsUserComment(sender: string) {
  if (user.value?.email === sender) {
    return 'justify-self-end'
  }
}

const handleSendComment = handleSubmit(async (values) => {
  const currentUser = user.value

  resetForm()

  props.ideaModalRef?.scrollTo({
    top: props.ideaModalRef.scrollHeight,
    behavior: 'smooth',
  })
})

const handleDeleteComment = async () => {
  const currentUser = user.value
}

const handleCheckComment = async () => {
  const currentUser = user.value
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  comment: Comment,
) => {
  const currentUser = user.value
}
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="fs-6 px-3">Комментарии</Typography>
    </div>

    <div
      v-if="idea?.comments"
      class="d-grid gap-3 pt-3 px-3 w-100"
    >
      <CommentVue
        v-for="comment in idea.comments"
        :key="comment.id"
        :class-name="checkIsUserComment(comment.sender)"
        :comment="comment"
        v-intersection-observer="(elem) => onIntersectionObserver(elem, comment)"
        @delete-comment="handleDeleteComment"
      />
    </div>

    <form class="comment-form p-3">
      <Input
        name="comment"
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
</style>
