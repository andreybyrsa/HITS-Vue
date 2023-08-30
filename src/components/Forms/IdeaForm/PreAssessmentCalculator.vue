<script setup lang="ts">
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  PreAssessmentProps,
  preAssessmentSelects,
} from '@Components/Forms/IdeaForm/PreAssessmentCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'

const preAssessmentValue = defineModel<{ preAssessment: number }>({
  required: true,
})

const props = defineProps<PreAssessmentProps>()

const preAssessmentPlaceholder = ref('вычисление')

const currentPreAssessment = computed(() => {
  const { realizability, suitability, budget } = props.idea
  if (realizability && suitability && budget) {
    return +((+realizability + +suitability + +budget) / 3).toFixed(1)
  }

  return NaN
})

watchImmediate(currentPreAssessment, (currentValue) => {
  if (currentValue) {
    preAssessmentValue.value.preAssessment = currentValue
  }
})

const intervalId = setInterval(() => {
  if (currentPreAssessment.value) {
    clearInterval(intervalId)
  }

  if (preAssessmentPlaceholder.value.includes('...')) {
    return (preAssessmentPlaceholder.value = 'вычисление')
  }
  return (preAssessmentPlaceholder.value += '.')
}, 200)
</script>

<template>
  <div class="row">
    <div
      class="col"
      v-for="(select, index) in preAssessmentSelects"
      :key="index"
    >
      <Select
        :name="select.name"
        :label="select.label"
        :options="select.options"
        placeholder="Выберите значение"
      ></Select>
    </div>
  </div>

  <div class="col">
    <Typography class-name="text-primary">
      Предварительная оценка: {{ currentPreAssessment || preAssessmentPlaceholder }}
    </Typography>
  </div>
</template>
