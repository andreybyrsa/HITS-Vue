<script lang="ts" setup>
import { computed } from 'vue'

import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import { CommentPlaceholderProps } from '@Components/Comment/Comment.types'

const props = defineProps<CommentPlaceholderProps>()

const CommentPlaceholderClassName = computed(() => [
  'comment card rounded-3 shadow',
  props.className,
])
</script>

<template>
  <div :class="CommentPlaceholderClassName">
    <div class="comment__header card-header">
      <div class="w-25">
        <LoadingPlaceholder />
      </div>

      <div class="w-75">
        <LoadingPlaceholder />
      </div>
    </div>
    <div class="card-body">
      <LoadingPlaceholder />
      <LoadingPlaceholder />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  width: 400px;

  &__header {
    @include flexible(center, space-between, $gap: 50px);
  }
}
</style>
