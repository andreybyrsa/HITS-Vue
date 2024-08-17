<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>
<template>
  <div class="d-flex flex-column m-3 gap-3">
    <div class="d-flex justify-content-center w-75">
      <LoadingPlaceholder />
    </div>
    <LoadingPlaceholder
      v-for="index in 3"
      :key="index"
      height="small"
    />
  </div>
</template>
