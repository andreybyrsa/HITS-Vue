<script lang="ts" setup>
import { computed } from 'vue'

import { IconEmits, IconProps } from '@Components/Icon/Icon.types'

const props = defineProps<IconProps>()

const emit = defineEmits<IconEmits>()

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

const IconBinds = computed(() => {
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
  <i
    :class="className"
    v-bind="IconBinds"
    @click="emit('click')"
  ></i>
</template>
