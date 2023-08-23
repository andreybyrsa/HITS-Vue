<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <LoadingPlaceholder
    v-for="value in 3"
    :key="value"
    height="medium"
  />
</template>
