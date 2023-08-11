<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import RatingData from '@Components/Forms/NewIdeaForm/ratingCalculator'
import Typography from '@Components/Typography/Typography.vue'

const ratingOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Средний', value: 3 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Высокий', value: 5 },
]

const rating: Ref<RatingData> = ref({
  realizability: 0,
  suitability: 0,
  budget: 0,
})

const totalRating = computed(() => {
  const { realizability, suitability, budget } = rating.value
  const total = ((realizability + suitability + budget) / 3).toFixed(1)
  console.log(realizability)
  return total
})

const selectNames = [
  {
    label: 'Реализуемость*',
    get value() {
      return rating.value.realizability
    },
    set value(newValue) {
      rating.value.realizability = newValue
    },
    forName: 'realizability',
  },
  {
    label: 'Пригодность*',
    get value() {
      return rating.value.suitability
    },
    set value(newValue) {
      rating.value.suitability = newValue
    },
    forName: 'suitability',
  },
  {
    label: 'Бюджет*',
    get value() {
      return rating.value.budget
    },
    set value(newValue) {
      rating.value.budget = newValue
    },
    forName: 'budget',
  },
]
</script>

<template>
  <div>
    <Typography class-name="fs-6 text-primary"
      >Предварительная оценка идеи</Typography
    >
    <div class="row">
      <div
        class="col"
        v-for="select in selectNames"
        :key="select.value"
      >
        <Typography class="fs-6 text-primary">
          <label :for="select.forName">{{ select.label }}</label>
          <select
            class="form-select"
            aria-label="Floating label select example"
            v-model="select.value"
          >
            <option
              disabled
              value=""
            >
              Выберите вариант
            </option>
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
    <Typography class-name="fs-6 text-primary">Рейтинг</Typography>
    <Typography class-name="fs-6 text-primary m-2">{{
      totalRating
    }}</Typography>
  </div>
</template>
