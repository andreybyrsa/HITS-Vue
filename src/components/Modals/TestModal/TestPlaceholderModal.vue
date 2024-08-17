<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="test-modal team-modal-placeholder p-3 h-100 overflow-y-scroll">
    <div class="team-modal-main w-100 h-100">
      <div class="d-flex gap-2 w-100 p-2 m-3">
        <div class="test-modal-buttons bg-primary py-3 rounded-3"></div>
        <div class="d-flex bg-white rounded-3 w-100">
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="d-flex flex-column bg-white rounded-3 gap-2 w-100 p-2 m-3">
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </div>

      <div class="d-flex bg-white rounded-3 w-100 m-3 p-2">
        <div class="test-modal-buttons bg-primary py-3 rounded-3"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test-modal-buttons {
  width: 10%;
}
</style>
