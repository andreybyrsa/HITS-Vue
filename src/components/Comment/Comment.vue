<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { toReactive, useDateFormat } from '@vueuse/core'

import { CommentProps, CommentEmits } from '@Components/Comment/Comment.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'

import useUserStore from '@Store/user/userStore'

const props = defineProps<CommentProps>()
const { comment, className } = toRefs(props)
const { senderEmail, checkedBy, text, createdAt } = toReactive(comment)

const emit = defineEmits<CommentEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const CommentClassName = computed(() => [
  'comment card rounded-3 shadow',
  className?.value,
])
const CommentHeaderClassName = computed(() => [
  'comment__header card-header',
  {
    'bg-primary bg-opacity-50': user.value && !checkedBy.includes(user.value.email),
  },
])

const getCurrentCommentDate = (createdAt: string) => {
  const currentDateCreated = new Date(
    new Date(createdAt).getTime() -
      new Date(createdAt).getTimezoneOffset() * 60 * 1000,
  )
  const currentDate = new Date()

  const time = useDateFormat(currentDateCreated, 'HH:mm')
  const date = useDateFormat(currentDateCreated, 'DD.MM.YYYY')

  const dateDifference =
    (currentDate.getTime() - currentDateCreated.getTime()) / (1000 * 60 * 60 * 24)

  if (dateDifference === 1) {
    return `вчера в ${time.value}`
  }

  if (dateDifference > 1) {
    return `${date.value} в ${time.value}`
  }

  return time.value
}
</script>

<template>
  <div :class="CommentClassName">
    <div :class="CommentHeaderClassName">
      <Typography class-name="text-primary">{{ senderEmail }}</Typography>

      <div class="comment__info">
        <span class="text-primary">
          {{ getCurrentCommentDate(createdAt) }}
        </span>

        <Button
          v-if="senderEmail === user?.email"
          class-name="p-1"
          variant="primary"
          prepend-icon-name="bi bi-list fs-5"
          v-dropdown="'commentVue'"
        />
        <DropDown id="commentVue">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item list-group-item-action comment__dropdown-button px-2 py-1"
              @click="emit('delete-comment')"
            >
              Удалить
            </li>
          </ul>
        </DropDown>
      </div>
    </div>

    <div class="card-body py-2">
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  width: 400px;

  &__header {
    @include flexible(center, space-between);

    transition: background-color 5s ease-out;
  }

  &__info {
    @include flexible(center, center, $gap: 8px);
  }

  &__dropdown-button {
    cursor: pointer;
  }
}
</style>
