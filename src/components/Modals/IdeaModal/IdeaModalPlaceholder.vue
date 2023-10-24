<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'
</script>

<template>
  <div class="idea-modal p-3 h-100 overflow-y-scroll">
    <div class="idea-modal-placeholder__left-side w-75">
      <div class="w-75">
        <LoadingPlaceholder />
      </div>

      <div class="p-2 bg-white rounded-3 d-flex flex-column gap-1">
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>

        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </div>

      <div class="p-2 bg-white rounded-3 gap-2 d-flex">
        <div
          v-for="index in 3"
          :key="index"
          class="w-25 h-25"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>

      <div class="pb-2 bg-white rounded-3">
        <IdeaCommentsPlaceholder />
      </div>
    </div>

    <div class="idea-modal-placeholder__right-side pb-3 w-25 bg-white rounded">
      <div class="bg-primary py-4 rounded-top-3"></div>

      <div class="px-2">
        <div
          v-for="index in 3"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="px-2">
        <div
          v-for="index in 3"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>

        <LoadingPlaceholder />
      </div>

      <div class="mt-3 px-2">
        <div class="w-100">
          <LoadingPlaceholder />
        </div>
        <div class="w-75">
          <LoadingPlaceholder />
        </div>
        <div class="w-75">
          <LoadingPlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-modal-placeholder {
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
