<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="team-modal-placeholder bg-white p-3">
    <div class="team-modal-placeholder__content h-100">
      <LoadingPlaceholder />

      <LoadingPlaceholder
        v-for="index in 2"
        :key="index"
        height="small"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-modal-placeholder {
  @include flexible(stretch, stretch);

  &__content {
    @include flexible(center, flex-start, column, $gap: 16px);
  }
}
</style>
