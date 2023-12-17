<script lang="ts" setup>
import AdvertisementPlaceholder from '@Components/Advertisement/AdvertisementPlaceholder.vue'
</script>

<template>
  <div class="d-grid gap-3 pt-2 px-2 w-100">
    <AdvertisementPlaceholder class-name="current-user-comment" />
    <AdvertisementPlaceholder />
    <AdvertisementPlaceholder class-name="current-user-comment" />
  </div>
</template>

<style lang="scss" scoped>
.current-user-comment {
  justify-self: end;
}
</style>
