<script lang="ts" setup>
import CommentPlaceholder from '@Components/Comment/CommentPlaceholder.vue'
</script>

<template>
  <div class="d-grid gap-3 pt-3 px-3 w-100">
    <CommentPlaceholder class-name="current-user-comment" />
    <CommentPlaceholder />
    <CommentPlaceholder class-name="current-user-comment" />
  </div>
</template>

<style lang="scss" scoped>
.current-user-comment {
  justify-self: end;
}
</style>
