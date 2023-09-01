<script lang="ts" setup>
import { computed } from 'vue'

import ButtonProps from '@Components/Button/Button.types'

const props = defineProps<ButtonProps>()

const collapseProps = {
  'data-bs-toggle': 'collapse',
  'data-bs-target': `#${props.id}`,
  'aria-expanded': false,
}
const dropDwonProps = {
  'data-bs-toggle': 'dropdown',
  'data-bs-auto-close': props.dropDownClickableInside ? 'outside' : true,
  'aria-expanded': false,
}

const ButtonClassName = computed(() => ['btn d-flex', props.className])

const ButtonBinds = computed(() => {
  if (props.isCollapseController) {
    return collapseProps
  }
  if (props.isDropDownController) {
    return dropDwonProps
  }
  return null
})
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
    v-bind="ButtonBinds"
  >
    <i
      v-if="prependIconName"
      :class="`${prependIconName} fs-5`"
    ></i>
    <slot></slot>

    <i
      v-if="appendIconName"
      :class="`${appendIconName} fs-5`"
    ></i>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  @include flexible(center, center, $gap: 4px);
}
</style>
