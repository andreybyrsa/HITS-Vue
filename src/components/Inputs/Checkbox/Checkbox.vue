<script lang="ts" setup>
import { computed } from 'vue'

import { CheckboxProps } from '@Components/Inputs/Checkbox/Checkbox.types'

const props = defineProps<CheckboxProps>()

const modelValue = defineModel({
  required: true,
})

const BoxInputClassName = computed(() => ['form-check-input', props.className])
const BoxLabelClassName = computed(() => ['form-check-label', props.className])
</script>

<template>
  <div class="form-check">
    <label
      :class="BoxLabelClassName"
      for="checkbox"
    >
      {{ label }}
    </label>
    <input
      name="checkbox"
      type="checkbox"
      :class="BoxInputClassName"
      v-model="modelValue"
      :value="value"
    />
  </div>
</template>
