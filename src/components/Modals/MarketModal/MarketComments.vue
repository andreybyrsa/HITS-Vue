<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import MarketCommentsProps from '@Components/Modals/MarketModal/MarketComments.types'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Comment from '@Domain/Comment'
import CommentVue from '@Components/Comment/Comment.vue'

import useUserStore from '@Store/user/userStore'

defineProps<MarketCommentsProps>()

const value = ref('')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const comments = ref<Comment[]>([
  {
    id: '1',
    ideaId: '1',
    createdAt: new Date(12, 10, 2023),

    comment: 'Через месяц заканчивается прием заявок!',
    sender: 'kirill.vlasov.05@inbox.ru',
    checkedBy: ['1'],
  },
])

function send(messange: string) {
  const mess = {
    id: '2',
    ideaId: '2',
    createdAt: new Date(12, 10, 2023),

    comment: messange,
    sender: 'kirill.vlasov.05@inbox.ru',
    checkedBy: ['2'],
  }
  if (messange) {
    comments.value.push(mess)
  }
  value.value = ''
}

function handleDeleteComment(commentId: string) {
  const newArrat = comments.value.filter((comment) => comment.id !== commentId)
  comments.value = newArrat
}
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="fs-6 px-3">Комментарии инициатора</Typography>
    </div>

    <!-- <IdeaCommentsPlaceholder v-if="commentsIsLoading" /> -->
    <div class="d-grid gap-3 pt-3 px-3 w-100">
      <CommentVue
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        class-name="current-user-comment"
        @delete-comment="handleDeleteComment(comment.id)"
      />
    </div>

    <form class="comment-form p-3">
      <Input
        v-if="user?.email == idea.initiator"
        v-model="value"
        name="exchangeInput"
        class-name="rounded-end"
        placeholder="Добавить комментарий"
      >
        <template #prepend>
          <i class="bi bi-chat"></i>
        </template>
      </Input>

      <Button
        v-if="user?.email == idea.initiator"
        class="btn-primary"
        @click="send(value)"
        >Отправить
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
