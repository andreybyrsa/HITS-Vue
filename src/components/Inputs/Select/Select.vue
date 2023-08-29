<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import { SelectProps } from '@Components/Inputs/Select/Select.types'

const props = defineProps<SelectProps>()

defineModel({
  required: false,
})

const { value: selectValue, errorMessage } = useField(props.name, props.validation, {
  validateOnValueUpdate: !!props.validation,
  syncVModel: true,
})

const SelectClassName = computed(() => [
  'form-select',
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
      v-if="label"
      :class="LabelClassName"
    >
      {{ label }}
    </label>

    <select
      :class="SelectClassName"
      v-model="selectValue"
      :disabled="disabled"
    >
      <option
        v-if="placeholder"
        :value="undefined"
        selected
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div class="invalid-feedback">
      {{ error || errorMessage }}
    </div>
  </div>
</template>
