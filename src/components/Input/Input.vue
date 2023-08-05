<script lang="ts" setup>
import { computed } from 'vue'

import { InputProps, InputEmits } from '@Components/Input/Input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
})

const emit = defineEmits<InputEmits>()

const InputClassName = computed(() => [
  'form-control form-control-lg',
  props.className,
])
</script>

<template>
  <div class="input-group">
    <span
      v-if="prepend || $slots.prepend"
      class="input-group-text fs-5"
    >
      {{ prepend }}
      <slot name="prepend"></slot>
    </span>

    <input
      name="name"
      :class="InputClassName"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
    />

    <span
      v-if="append || $slots.append"
      class="input-group-text"
    >
      {{ append }}
      <slot name="append"></slot>
    </span>
  </div>
</template>
