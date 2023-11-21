<script lang="ts" setup>
import { computed } from 'vue'

import LoadingPlaceholderProps from '@Components/LoadingPlaceholder/LoadingPlaceholder.types'

const props = defineProps<LoadingPlaceholderProps>()

const LoadingPlaceholderClassName = computed(() => [
  'placeholder w-100 bg-secondary rounded',
  props.className,
  props.height,
])
</script>

<template>
  <div class="placeholder-glow w-100">
    <span :class="LoadingPlaceholderClassName"></span>
  </div>
</template>

<style lang="scss" scoped>
.small {
  height: 50px;
}

.medium {
  height: 100px;
}

.third {
  height: 300px;
}

.medium-200,
.second {
  height: 200px;
}

.large {
  height: 100%;
}

.large-500 {
  height: 500px;
}
</style>
