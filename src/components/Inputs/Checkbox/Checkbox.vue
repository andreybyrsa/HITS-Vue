<script lang="ts" setup>
import { computed } from 'vue'

import {
  CheckboxProps,
  CheckboxEmits,
} from '@Components/Inputs/Checkbox/Checkbox.types'

const props = defineProps<CheckboxProps>()

const emit = defineEmits<CheckboxEmits>()

const BoxInputClassName = computed(() => ['form-check-input', props.className])
const BoxLabelClassName = computed(() => ['form-check-label', props.className])
</script>

<template>
  <div class="form-check">
    <label
      :class="BoxLabelClassName"
      for="name"
    >
      {{ label }}
    </label>
    <input
      name="name"
      :class="BoxInputClassName"
      type="checkbox"
      :value="value"
    />
  </div>
</template>
