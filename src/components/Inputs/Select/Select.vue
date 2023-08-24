<script lang="ts" setup>
import { computed } from 'vue'

import SelectProps from '@Components/Inputs/Select/Select.types'

const props = defineProps<SelectProps>()

const modelValue = defineModel({
  required: false,
})

const SelectClassName = computed(() => ['form-select', props.className])
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
      v-model="modelValue"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
