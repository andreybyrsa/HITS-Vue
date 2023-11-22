<script lang="ts" setup>
import { computed } from 'vue'

import TypographyProps from '@Components/Typography/Typography.types'
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

<style lang="scss">
.hint {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  color: #007bff;
}

.tooltip {
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
