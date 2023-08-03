<script lang="ts" setup>
import { computed } from 'vue'
import ButtonProps from './Button.types'

const props = defineProps<ButtonProps>()

const ButtonClassName = computed(() => ['btn btn-lg d-flex', props.className])
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
  >
    <i
      v-if="props.iconName"
      :class="props.iconName"
    ></i>
    <slot></slot>
  </button>
</template>

<style lang="scss">
.btn {
  @include flexible(center, center, $gap: 4px);
}
</style>
