<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import RadioProps from '@Components/Inputs/Radio/Radio.types'

const props = defineProps<RadioProps>()

defineModel({
  required: false,
})

const { value, errorMessage } = useField(() => props.name, undefined, {
  type: 'radio',
  checkedValue: props.value,
  validateOnValueUpdate: false,
  syncVModel: true,
})

const RadioInputClassName = computed(() => [
  'form-check-input',
  { 'is-invalid': errorMessage.value || props.error },
  props.className,
])

const RadioLabelClassName = computed(() => [
  'form-check-label',
  props.className,
])
</script>

<template>
  <div class="form-check">
    <label
      :class="RadioLabelClassName"
      :for="name"
    >
      {{ label }}
    </label>
    <input
      :name="name"
      type="radio"
      :class="RadioInputClassName"
      v-model="value"
      :value="props.value"
    />
  </div>
</template>
