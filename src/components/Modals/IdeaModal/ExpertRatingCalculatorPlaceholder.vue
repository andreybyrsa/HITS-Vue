<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="bg-white rounded-3 p-3 combined-rating d-grid w-100">
    <div class="w-100 row row-cols-2">
      <div
        class="w-50 col-2 mb-2"
        v-for="index in 5"
        :key="index"
      >
        <LoadingPlaceholder height="small" />
      </div>
    </div>

    <LoadingPlaceholder />
  </div>
</template>

<style lang="scss" scoped>
.combined-rating {
  @include flexible(flex-start, stretch, column, $gap: 8px);
}
</style>
