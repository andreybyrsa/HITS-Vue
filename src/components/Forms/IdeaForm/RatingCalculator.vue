<script setup lang="ts">
import { computed, watch } from 'vue'

import {
  ratingSelects,
  RatingData,
} from '@Components/Forms/IdeaForm/RatingCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'

const ratingData = defineModel<RatingData>({
  required: true,
})

const ratingOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Средний', value: 3 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Высокий', value: 5 },
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
  <div class="row">
    <div
      class="col"
      v-for="(select, index) in ratingSelects"
      :key="index"
    >
      <Select
        :label="select.label"
        :options="ratingOptions"
        v-model="ratingData[select.key]"
      ></Select>
    </div>
  </div>

  <div class="col">
    <Typography class-name="fs-6 text-primary">
      Рейтинг: {{ ratingData.rating }}
    </Typography>
  </div>
</template>
