<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Skills from '@Components/Skills/Skills.vue'
</script>

<template>
  <div
    v-for="value in 3"
    :key="value"
    class="col"
  >
    <div class="p-3 w-100 rounded border shadow-sm d-flex flex-column gap-2">
      <div class="w-50">
        <LoadingPlaceholder />
      </div>

      <LoadingPlaceholder />
      <LoadingPlaceholder />

      <div class="w-25">
        <LoadingPlaceholder />
      </div>

      <Skills />

      <div class="mt-1 pt-2 border-top d-flex gap-1">
        <div
          v-for="value in 3"
          :key="value"
          class="w-25"
        >
          <LoadingPlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>
