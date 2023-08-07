<script lang="ts" setup>
import { computed } from 'vue'

import { RadioProps, RadioEmits } from '@Components/Inputs/Radio/Radio.types'

const props = defineProps<RadioProps>()

const emit = defineEmits<RadioEmits>()

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
      type="radio"
      @click="emit('click')"
    />
  </div>
</template>
