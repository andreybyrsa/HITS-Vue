<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-75 d-flex flex-column gap-3">
    <LoadingPlaceholder
      v-for="value in 2"
      :key="value"
      height="small"
    />

    <LoadingPlaceholder
      v-for="value in 4"
      :key="value"
      height="medium"
    />

    <div class="d-flex gap-3">
      <LoadingPlaceholder
        v-for="value in 3"
        :key="value"
        height="small"
      />
    </div>
  </div>
</template>
