<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-100 d-flex flex-column gap-3">
    <LoadingPlaceholder
      v-for="index in 3"
      :key="index"
      height="small"
    />

    <div class="w-100 d-flex gap-3">
      <div class="w-50 d-flex gap-3">
        <div
          v-for="index in 4"
          :key="index"
          class="team-member-placeholder"
        >
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="w-50">
        <LoadingPlaceholder height="medium" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-member-placeholder {
  width: 100px;
}
</style>
