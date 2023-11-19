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
  validateOnValueUpdate: props.validateOnUpdate ?? false,
  validateOnMount: false,
  controlled: props.noFormCotrolled ? false : true,
  syncVModel: true,
})

const RadioInputClassName = computed(() => [
  'form-check-input',
  { 'is-invalid': errorMessage.value || props.error },
  props.className,
])

const RadioLabelClassName = computed(() => ['form-check-label', props.className])
</script>

<template>
  <div class="d-flex gap-2">
    <input
      :name="name"
      type="radio"
      :class="RadioInputClassName"
      v-model="value"
      :value="props.value"
    />
    <span :class="RadioLabelClassName">
      {{ label }}
    </span>
  </div>
</template>
