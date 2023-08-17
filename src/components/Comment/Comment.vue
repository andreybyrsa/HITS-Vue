<script lang="ts" setup>
import { computed } from 'vue'

import CommentProps from '@Components/Comment/Comment.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'

const props = defineProps<CommentProps>()

const CommentClassName = computed(() => [
  'comment card rounded-3 shadow',
  props.className,
])

const getCurrentCommentDate = (dateCreated: Date) => {
  const dateDifference = new Date(
    new Date().getMilliseconds() - dateCreated.getMilliseconds(),
  )
  const secondsDifference = dateDifference.getSeconds()
  const minutesDifference = dateDifference.getMinutes()
  const hoursDifference = dateDifference.getHours()

  if (secondsDifference < 60) {
    return 'Несколько секунд назад'
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} мин. назад`
  }

  if (hoursDifference < 24) {
    return `${hoursDifference} ч. назад`
  }

  return `${Math.floor(hoursDifference / 24)} д. назад`
}
</script>

<template>
  <div :class="CommentClassName">
    <div class="comment__header card-header">
      <Typography>{{ commnet.sender }}</Typography>

      <div class="comment__info">
        <div class="text-primary">
          {{ getCurrentCommentDate(new Date()) }}
        </div>

        <Button
          class-name="btn-primary p-1"
          prepend-icon-name="bi bi-list fs-3"
          is-drop-down-controller
        ></Button>
        <DropDown>
          <button>Удалить</button>
        </DropDown>
      </div>
    </div>

    <div class="card-body">
      {{ commnet.comment }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  width: 500px;

  &__header {
    @include flexible(center, space-between);
  }

  &__info {
    @include flexible(center, center, $gap: 8px);
  }
}
</style>
