<script setup lang="ts">
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useField } from 'vee-validate'

import {
  PreAssessmentProps,
  PreAssessmentSelect,
  preAssessmentSelects,
} from '@Components/Forms/IdeaForm/PreAssessmentCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

const { value: preAssessmentValue } = useField<number>('preAssessment', undefined, {
  validateOnMount: false,
  validateOnValueUpdate: true,
})

const props = defineProps<PreAssessmentProps>()

const preAssessmentPlaceholder = ref('вычисление')

const currentPreAssessment = computed(() => {
  const { suitability, budget } = props.idea
  if (suitability && budget) {
    return +((suitability + budget) / 2).toFixed(1)
  }

  return NaN
})

watchImmediate(currentPreAssessment, (currentValue) => {
  if (currentValue) {
    preAssessmentValue.value = currentValue
  }
})

const intervalId = setInterval(() => {
  if (currentPreAssessment.value) {
    clearInterval(intervalId)
  }

  if (preAssessmentPlaceholder.value.includes('...')) {
    preAssessmentPlaceholder.value = 'вычисление'
  } else {
    preAssessmentPlaceholder.value += '.'
  }
}, 200)

function getCurrentTooltip(select: PreAssessmentSelect) {
  const selectValue = props.idea[select.name]
  if (selectValue) {
    return select.options.find((option) => option.value === selectValue)?.label
  }
}
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
        validate-on-update
        :label="select.label"
        :options="select.options"
        v-tooltip="getCurrentTooltip(select)"
        placeholder="Выберите значение"
      ></Select>
    </div>
  </div>

  <div class="col">
    <Typography class-name="text-primary">
      Предварительная оценка: {{ currentPreAssessment || preAssessmentPlaceholder }}
    </Typography>

    <ProgressBar
      v-if="currentPreAssessment"
      class="mt-2"
      :value="currentPreAssessment"
      :max="5"
    />
    <LoadingPlaceholder v-else />
  </div>
</template>
