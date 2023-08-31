<script lang="ts" setup>
import ProgressBarProps from '@Components/ProgressBar/ProgressBar.types'
import { computed } from 'vue'

const props = defineProps<ProgressBarProps>()
const progressBarStyle = computed(() => {
  const width = (props.value / props.max) * 100

  if (width < 61) {
    return {
      width: `${width}%`,
      backgroundColor: '#dc3545',
    }
  } else if (width >= 61 && width < 76) {
    return {
      width: `${width}%`,
      backgroundColor: '#fd7e14',
    }
  } else if (width >= 76 && width < 91) {
    return {
      width: `${width}%`,
      backgroundColor: '#ffc107',
    }
  } else {
    return {
      width: `${width}%`,
      backgroundColor: '#198754',
    }
  }
})
</script>

<template>
  <div class="progress w-100">
    <div
      class="progress-bar progress-bar-animated"
      :style="progressBarStyle"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  transition: all $default-transition-settings;
}
</style>
