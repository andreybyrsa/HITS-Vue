<script lang="ts" setup>
import ButtonProps from './Button.types'
const props = defineProps<ButtonProps>()
</script>
<template>
  <button>
    <i
      v-if="props.iconName"
      :class="props.iconName"
    ></i>
    <slot />
  </button>
</template>
