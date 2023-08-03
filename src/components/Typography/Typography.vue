<script lang="ts" setup>
import { computed } from 'vue'
import TypographyProps from '@Components/Typography/Typography.types'

const props = defineProps<TypographyProps>()

const typographyClassName = computed(() => {
  return [props.className]
})
</script>

<template>
  <span :class="typographyClassName"><slot></slot></span>
</template>
