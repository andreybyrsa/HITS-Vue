<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'
</script>

<template>
  <div class="market-modal p-3 h-100 overflow-y-scroll">
    <div class="placeholder-market__left w-75">
      <div class="d-flex gap-3 w-100">
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>

      <div
        v-for="index in 2"
        :key="index"
        class="p-2 bg-white rounded-3"
      >
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>

      <div class="pb-2 bg-white rounded-3">
        <IdeaCommentsPlaceholder />
      </div>
    </div>

    <div class="placeholder-market__right w-25">
      <LoadingPlaceholder height="small" />
      <div
        v-for="index in 3"
        :key="index"
        class="p-2 bg-white rounded-3"
      >
        <div
          v-for="index in 2"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>
      </div>
      <div
        v-for="index in 4"
        :key="index"
      >
        <LoadingPlaceholder height="small" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.placeholder-market {
  @include flexible(flex-start, flex-start, $gap: 16px);

  &__left {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
  &__right {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}
</style>
