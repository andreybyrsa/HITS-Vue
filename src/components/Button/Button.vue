<script lang="ts" setup>
import { computed } from 'vue'

import ButtonProps from '@Components/Button/Button.types'

const props = defineProps<ButtonProps>()

const ButtonClassName = computed(() => ['btn d-flex', props.className])
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
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
