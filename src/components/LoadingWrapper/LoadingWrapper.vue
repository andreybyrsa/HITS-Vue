<script lang="ts" setup>
import { computed } from 'vue'
import { LoadingWrapperProps } from '@Components/LoadingWrapper/LoadingWrapper.types'
import LoadingSpinner from '@Components/LoadingSpinner/LoadingSpinner.vue'

const props = defineProps<LoadingWrapperProps>()

const LoadingWrapperClassName = computed(() => [
  'position-absolute',
  'top-0',
  'bottom-0',
  'start-0',
  'end-0',
  'd-flex',
  'align-items-center',
  'justify-content-center',
  'rounded',
  'bg-secondary',
  'bg-opacity-25',
  props.className ?? '',
])
</script>

<template>
  <div
    v-if="isLoading"
    :class="LoadingWrapperClassName"
  >
    <LoadingSpinner
      class-name="text-secondary"
      :is-loading="isLoading"
    />
  </div>
</template>
