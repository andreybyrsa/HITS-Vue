<script lang="ts" setup>
import { computed } from 'vue'
import { ButtonProps, ButtonEmits } from './Button.types'

const props = defineProps<ButtonProps>()

const emit = defineEmits<ButtonEmits>()

const ButtonClassName = computed(() => ['btn btn-lg d-flex', props.className])
</script>

<template>
  <button
    type="button"
    :class="ButtonClassName"
    @click="emit('click')"
  >
    <i
      v-if="props.iconName"
      :class="props.iconName"
    ></i>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  @include flexible(center, center, $gap: 4px);
}
</style>
