<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-100">
    <LoadingPlaceholder />
    <div class="d-flex gap-3 w-100 mt-3">
      <div class="d-flex flex-column gap-3 w-25">
        <LoadingPlaceholder />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
      </div>
      <div class="d-flex flex-column gap-3 w-75">
        <LoadingPlaceholder />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
