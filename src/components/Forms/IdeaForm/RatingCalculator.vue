<script setup lang="ts">
import { computed, reactive } from 'vue'

import {
  RatingData,
  RatingCalculatorEmits,
} from '@Components/Forms/IdeaForm/RatingCalculator.types'
import Typography from '@Components/Typography/Typography.vue'

const emit = defineEmits<RatingCalculatorEmits>()

interface SelectName {
  label: string
  key: keyof RatingData
  forName: string
}

const ratingOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Средний', value: 3 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Высокий', value: 5 },
]

const rating = reactive<RatingData>({
  realizability: 1,
  suitability: 1,
  budget: 1,
})

const totalRating = computed(() => {
  const { realizability, suitability, budget } = rating
  const total = ((realizability + suitability + budget) / 3).toFixed(1)
  emit('set-rating', +total)

  return total
})

const selectNames: SelectName[] = [
  {
    label: 'Реализуемость*',
    key: 'realizability',
    forName: 'realizability',
  },
  {
    label: 'Пригодность*',
    key: 'suitability',
    forName: 'suitability',
  },
  {
    label: 'Бюджет*',
    key: 'budget',
    forName: 'budget',
  },
]
</script>

<template>
  <div>
    <Typography class-name="fs-6 text-primary">
      Предварительная оценка идеи
    </Typography>

    <div class="row">
      <div
        class="col"
        v-for="(select, index) in selectNames"
        :key="index"
      >
        <Typography class="fs-6 text-primary">
          <label :for="select.forName">{{ select.label }}</label>
          <select
            class="form-select"
            v-model="rating[select.key]"
          >
            <option
              v-for="option in ratingOptions"
              :value="option.value"
              :key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </Typography>
      </div>
    </div>
  </div>

  <div class="col">
    <Typography class-name="fs-6 text-primary">
      Рейтинг: {{ totalRating }}
    </Typography>
  </div>
</template>
