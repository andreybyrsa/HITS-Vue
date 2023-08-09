<script lang="ts" setup>
import { computed } from 'vue'

import { InputProps } from '@Components/Inputs/Input/Input.types'

const props = defineProps<InputProps>()

const modelValue = defineModel<string>({
  required: false,
})

const InputClassName = computed(() => [
  'form-control form-control-lg',
  { 'is-invalid': props.error },
  props.className,
])
</script>

<template>
  <div class="input-group d-flex">
    <span
      v-if="prepend || $slots.prepend"
      class="input-group-text fs-5"
    >
      {{ prepend }}
      <slot name="prepend"></slot>
    </span>

    <input
      :class="InputClassName"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      v-model="modelValue"
    />
    <span class="invalid-feedback">
      {{ error }}
    </span>

    <span
      v-if="append || $slots.append"
      class="input-group-text"
    >
      {{ append }}
      <slot name="append"></slot>
    </span>
  </div>
</template>
