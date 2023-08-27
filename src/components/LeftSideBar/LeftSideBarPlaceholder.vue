<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="p-3 d-flex flex-column gap-2">
    <LoadingPlaceholder
      v-for="value in 6"
      :key="value"
      height="small"
    />
  </div>
</template>
