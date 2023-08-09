<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import { InputProps } from '@Components/Inputs/Input/Input.types'

const props = defineProps<InputProps>()

defineModel<string>({
  required: false,
})

const { value, errorMessage } = useField(props.name, props.validation, {
  validateOnValueUpdate: !!props.validation ?? false,
  syncVModel: true,
})

const InputClassName = computed(() => [
  'form-control form-control-lg',
  { 'is-invalid': props.error || errorMessage.value },
  props.className,
])
const LabelClassName = computed(() => ['form-label', props.className])
</script>

<template>
  <label
    :class="LabelClassName"
    v-if="label"
  >
    {{ label }}
  </label>

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
      v-model="value"
    />
    <span class="invalid-feedback">
      {{ error || errorMessage }}
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
