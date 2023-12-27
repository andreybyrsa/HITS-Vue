<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-100 d-flex flex-column gap-3">
    <div
      v-for="value in 3"
      :key="value"
      class="w-100 p-2 border bg-white rounded-3"
    >
      <div class="d-flex justify-content-between">
        <div class="w-50">
          <LoadingPlaceholder />
        </div>
        <div class="w-25">
          <LoadingPlaceholder />
        </div>
      </div>

      <hr class="my-2 hr hr-blurry" />

      <LoadingPlaceholder />
    </div>
  </div>
</template>
