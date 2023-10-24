<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import CheckboxProps from '@Components/Inputs/Checkbox/Checkbox.types'

const props = defineProps<CheckboxProps>()

defineModel({
  required: false,
})

const { value, errorMessage } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.value,
  validateOnValueUpdate: props.validateOnUpdate ?? false,
  validateOnMount: false,
  controlled: props.noFormControlled ? false : true,
  syncVModel: true,
})

const BoxInputClassName = computed(() => [
  'form-check-input',
  { 'is-invalid': errorMessage.value || props.error },
  props.className,
])

const BoxLabelClassName = computed(() => ['form-check-label', props.className])
</script>

<template>
  <div class="d-flex gap-2">
    <input
      type="checkbox"
      :name="name"
      :class="BoxInputClassName"
      v-model="value"
      :value="props.value"
    />
    <span :class="BoxLabelClassName">
      {{ label }}
    </span>
  </div>
</template>
