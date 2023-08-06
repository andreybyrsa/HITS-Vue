<script lang="ts" setup>
import { computed } from 'vue'
import { InputProps, InputEmits } from '@Components/Inputs/Input/Input.types'

const props = defineProps<InputProps>()

const modelValue = defineModel<string>({
  required: true,
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
      :class="InputClassName"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      v-model="modelValue"
      @change="emit('change')"
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
