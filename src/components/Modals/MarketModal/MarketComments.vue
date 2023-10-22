<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import MarketCommentsProps from '@Components/Modals/MarketModal/MarketComments.types'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Comment from '@Domain/Comment'
import CommentVue from '@Components/Comment/Comment.vue'

import useUserStore from '@Store/user/userStore'
import CommentService from '@Services/CommentService'

defineProps<MarketCommentsProps>()

const value = ref('')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const comments = ref<Comment[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const id = +route.params.id

    const response = await CommentService.getComments(id, token)

    if (response instanceof Error) {
      return
    }

    comments.value = response
  }
})
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="fs-6 px-3">Комментарии инициатора</Typography>
    </div>

    <div class="d-grid gap-3 pt-3 px-3 w-100">
      <CommentVue
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        class-name="current-user-comment"
        @delete-comment="CommentService.deleteComment(comment.id, user?.token)"
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
