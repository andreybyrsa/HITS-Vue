<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-100 d-flex justify-content-center">
    <div class="w-50">
      <LoadingPlaceholder />
    </div>
  </div>

  <LoadingPlaceholder height="small" />

  <div class="d-flex gap-3">
    <div
      class="w-50 d-flex flex-column gap-2"
      v-for="index in 2"
      :key="index"
    >
      <LoadingPlaceholder />

      <LoadingPlaceholder height="medium" />
    </div>
  </div>

  <LoadingPlaceholder height="small" />
</template>
