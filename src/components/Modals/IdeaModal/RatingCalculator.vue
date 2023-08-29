<script setup lang="ts">
import { computed, watch } from 'vue'

import {
  ratingSelects,
  RatingData,
} from '@Components/Modals/IdeaModal/RatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'

const ratingData = defineModel<RatingData>({
  required: true,
})

const ratingOptions = [
  { label: 'Высокий', value: 5 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Средний', value: 3 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Низкий', value: 1 },
]

const totalRating = computed(() => {
  const { realizability, suitability, budget } = ratingData.value
  const rating = +((+realizability + +suitability + +budget) / 3).toFixed(1)

  return rating
})

watch(totalRating, () => {
  ratingData.value.rating = totalRating.value
})
</script>

<template>
  <div class="w-50 d-flex flex-column gap-2">
    <div
      v-for="(select, index) in ratingSelects"
      :key="index"
    >
      <Select
        :name="select.name"
        :label="select.label"
        :options="ratingOptions"
        v-model="ratingData[select.key]"
        :default-value="0"
      ></Select>
    </div>
  </div>
</template>
