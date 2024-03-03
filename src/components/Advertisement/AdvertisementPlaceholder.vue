<script lang="ts" setup>
import { computed } from 'vue'
import { AdvertisementPlaceholderProps } from '@Components/Advertisement/Advertisement.types'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

const props = defineProps<AdvertisementPlaceholderProps>()

const AdvertisementPlaceholderClassName = computed(() => [
  'advertisement card rounded-3 shadow',
  props.className ?? '',
])
</script>

<template>
  <div :class="AdvertisementPlaceholderClassName">
    <div class="card-header d-flex gap-3 justify-content-between align-items-center">
      <div class="w-25">
        <LoadingPlaceholder />
      </div>

      <div class="w-75">
        <LoadingPlaceholder />
      </div>
    </div>
    <div class="card-body">
      <LoadingPlaceholder />
      <LoadingPlaceholder />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.advertisement {
  width: 400px;
}
</style>
