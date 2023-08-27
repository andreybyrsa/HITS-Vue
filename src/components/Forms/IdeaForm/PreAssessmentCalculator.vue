<script setup lang="ts">
import { computed, watch } from 'vue'

import {
  PreAssessmentData,
  preAssessmentSelects,
} from '@Components/Forms/IdeaForm/PreAssessmentCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'

const preAssessmentData = defineModel<PreAssessmentData>({
  required: true,
})

const preAssessmentOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Средний', value: 3 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Высокий', value: 5 },
]

const totalPreAssessment = computed(() => {
  const { realizability, suitability, budget } = preAssessmentData.value
  const rating = +((+realizability + +suitability + +budget) / 3).toFixed(1)

  return rating
})

watch(totalPreAssessment, () => {
  preAssessmentData.value.preAssessment = totalPreAssessment.value
})
</script>

<template>
  <div class="row">
    <div
      class="col"
      v-for="(select, index) in preAssessmentSelects"
      :key="index"
    >
      <Select
        :label="select.label"
        :options="preAssessmentOptions"
        v-model="preAssessmentData[select.key]"
      ></Select>
    </div>
  </div>

  <div class="col">
    <Typography class-name="text-primary">
      Предварительная оценка: {{ preAssessmentData.preAssessment }}
    </Typography>
  </div>
</template>
