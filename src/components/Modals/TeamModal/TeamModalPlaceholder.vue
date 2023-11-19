<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="team-modal p-3 h-100 overflow-y-scroll">
    <div class="team-modal-placeholder__left-side w-75 h-100">
      <LoadingPlaceholder height="small" />

      <div class="p-2 bg-white rounded-3 d-flex flex-column gap-1">
        <div
          v-for="index in 3"
          :key="index"
          :class="`w-100`"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>
    </div>

    <div class="team-modal-placeholder__right-side p-2 w-25 bg-white rounded">
      <div class="px-2">
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-100`"
        >
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="px-2">
        <div
          v-for="index in 4"
          :key="index"
          :class="`w-100 py-1`"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-modal-placeholder {
  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}
</style>
