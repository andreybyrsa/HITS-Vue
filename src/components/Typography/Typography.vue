<script lang="ts" setup>
import { computed } from 'vue'
import { TypographyProps } from '@Components/Typography/Typography.types'
import Icon from '@Components/Icon/Icon.vue'

const props = defineProps<TypographyProps>()
const isTextProperty = props.className?.includes('fs')

const typographyClassName = computed(() => {
  return [{ 'fs-6': !isTextProperty }, props.className]
})
</script>

<template>
  <span :class="typographyClassName"><slot></slot></span>
  <Icon
    class-name="bi bi-patch-question"
    v-if="hint"
    class="hint"
    v-tooltip="hint"
  ></Icon>
</template>
