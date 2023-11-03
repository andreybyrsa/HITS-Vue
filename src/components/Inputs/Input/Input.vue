<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import { InputProps, InputEmits } from '@Components/Inputs/Input/Input.types'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

const props = defineProps<InputProps>()

const emit = defineEmits<InputEmits>()

defineModel<string>({
  required: false,
})

const { value, errorMessage } = useField(props.name, props.validation, {
  validateOnValueUpdate: props.validateOnUpdate ?? false,
  validateOnMount: false,
  controlled: props.noFormControlled ? false : true,
  syncVModel: true,
})

const InputClassName = computed(() => [
  'form-control',
  { 'is-invalid': props.error || errorMessage.value },
  props.className,
])
const LabelClassName = computed(() => [
  'form-label text-primary',
  props.labelClassName,
])
</script>

<template>
  <div class="w-100">
    <label
      :class="LabelClassName"
      v-if="label"
    >
      {{ label }}
    </label>

    <div class="input-group">
      <span
        v-if="prepend || $slots.prepend"
        class="input-group-text fs-6"
      >
        {{ prepend }}
        <slot name="prepend"></slot>
      </span>

      <input
        :class="InputClassName"
        :type="type ?? 'text'"
        v-model="value"
        @input="(event) => emit('input', event as HTMLTargetEvent)"
        @change="(event) => emit('change', event as HTMLTargetEvent)"
        @focus="emit('focus')"
        @blur="emit('blur')"
        @keydown="(event) => emit('keydown', event as KeyboardEvent)"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <div class="invalid-feedback">
        {{ error || errorMessage }}
      </div>

      <span
        v-if="append || $slots.append"
        class="input-group-text fs-6"
      >
        {{ append }}
        <slot name="append"></slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-control::placeholder {
  color: $black-color;
}
</style>
