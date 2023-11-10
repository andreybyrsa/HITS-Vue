<script lang="ts" setup>
import { computed } from 'vue'

import LoadingSpinnerProps from '@Components/LoadingSpinner/LoadingSpinner.types'

const props = defineProps<LoadingSpinnerProps>()

const SpinnerClassName = computed(() => [
  'spinner-border',
  { [`text-${props.type}`]: props.type },
  { [`spinner-border-${props.size}`]: props.size },
  props.className,
])
</script>

<template>
  <div :class="SpinnerClassName"></div>
</template>
