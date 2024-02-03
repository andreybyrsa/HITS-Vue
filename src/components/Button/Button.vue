<script lang="ts" setup>
import { computed } from 'vue'

import { ButtonProps } from '@Components/Button/Button.types'
import Icon from '@Components/Icon/Icon.vue'
import LoadingSpinner from '@Components/LoadingSpinner/LoadingSpinner.vue'

const props = defineProps<ButtonProps>()

const ButtonClassName = computed(() => [
  'btn d-flex',
  { [`btn-${props.variant}`]: props.variant },
  props.className,
])

const ButtonSlotClassName = computed(() => [{ ['btn-maxWidth']: props.maxWidth }])
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
  >
    <Icon
      v-if="prependIconName"
      :class-name="`${prependIconName} fs-5`"
    />

    <LoadingSpinner
      v-if="isLoading"
      :is-loading="isLoading"
      size="sm"
    />

    <div
      :class="ButtonSlotClassName"
      :style="props.maxWidth && { maxWidth: props.maxWidth }"
    >
      <slot></slot>
    </div>

    <Icon
      v-if="appendIconName"
      :class-name="`${appendIconName} fs-5`"
    />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  @include flexible(center, center, $gap: 4px);

  &-maxWidth {
    @include textEllipsis(1);
    overflow-wrap: unset;
  }
}
</style>
