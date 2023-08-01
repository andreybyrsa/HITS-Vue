<script lang="ts" setup>
import { computed } from 'vue'
import TypographyProps from '@Components/Typography/TypographyComp.types'

const props = defineProps<TypographyProps>()

const typographyClassName = computed(() => {
  return [props.class]
})
</script>

<template>
  <p :class="typographyClassName"><slot></slot></p>
</template>
