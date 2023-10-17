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
  'form-check-input m-1',
  { 'is-invalid': errorMessage.value || props.error },
  props.className,
])

const BoxLabelClassName = computed(() => ['form-check-label ms-1', props.className])
</script>

<template>
  <div :class="wrapperClassName">
    <input
      type="checkbox"
      :name="name"
      :class="BoxInputClassName"
      v-model="value"
      :value="props.value"
    />
    <label
      v-if="label"
      :class="BoxLabelClassName"
      :for="name"
    >
      {{ label }}
    </label>
  </div>
</template>

<!-- <style lang="scss" scoped>
.form-check-input:checked {
  background-color: black;
}
</style> -->
