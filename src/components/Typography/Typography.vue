<script lang="ts" setup>
import { computed } from 'vue'

import TypographyProps from '@Components/Typography/Typography.types'

const props = defineProps<TypographyProps>()

const isTextProperty = props.className?.includes('fs')

const typographyClassName = computed(() => {
  return [{ 'fs-5': !isTextProperty }, props.className]
})
</script>

<template>
  <span :class="typographyClassName"><slot></slot></span>
</template>
