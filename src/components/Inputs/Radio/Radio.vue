<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import RadioProps from '@Components/Inputs/Radio/Radio.types'

const props = defineProps<RadioProps>()

defineModel({
  required: false,
})

const { value, errorMessage, meta } = useField(() => props.name, undefined, {
  type: 'radio',
  checkedValue: props.value,
  validateOnValueUpdate: props.validateOnUpdate ?? false,
  validateOnMount: false,
  controlled: props.noFormCotrolled ? false : true,
  syncVModel: true,
})

const RadioInputClassName = computed(() => [
  'form-check-input',
  { 'is-invalid': meta.touched && (props.error || errorMessage.value) },
  props.className,
])

const RadioLabelClassName = computed(() => [
  'form-check-label ms-2',
  props.className,
])
</script>

<template>
  <div class="d-flex">
    <input
      :name="name"
      type="radio"
      :class="RadioInputClassName"
      v-model="value"
      :value="props.value"
      :checked="props.checked"
    />
    <span :class="RadioLabelClassName">
      {{ label }}
    </span>
  </div>
</template>
