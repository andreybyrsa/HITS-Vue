<script lang="ts" setup>
import { computed } from 'vue'

import ButtonProps from '@Components/Button/Button.types'

const props = defineProps<ButtonProps>()

const ButtonClassName = computed(() => ['btn btn-lg d-flex', props.className])

const dropDownProps = {
  'data-bs-toggle': 'collapse',
  'data-bs-target': `#${props.id}`,
  'aria-expanded': false,
}
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
    v-bind="isDropDownController && dropDownProps"
  >
    <i
      v-if="iconName"
      :class="iconName"
    ></i>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  @include flexible(center, center, $gap: 4px);
}
</style>
