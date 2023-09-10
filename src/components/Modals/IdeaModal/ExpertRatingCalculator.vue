<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import {
  ExpertConfirmation,
  ratingSelects,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'

const router = useRouter()

const initialOverallRating = ref('вычисление')

const { values, handleSubmit } = useForm<ExpertConfirmation>({
  validationSchema: {
    marketValue: (value: number) => value > 0 || 'Поле не заполнено',
    originality: (value: number) => value > 0 || 'Поле не заполнено',
    technicalRealizability: (value: number) => value > 0 || 'Поле не заполнено',
    suitability: (value: number) => value > 0 || 'Поле не заполнено',
    budget: (value: number) => value > 0 || 'Поле не заполнено',
  },
})

const overallRating = computed(() => {
  const expertValues = Object.values(values)
  if (expertValues.every((value) => value > 0)) {
    const expertRatingSum = expertValues.reduce(
      (prevValue, value) => (prevValue += value),
      0,
    )

    return +(expertRatingSum / 7).toFixed(1)
  }

  return NaN
})

const handleUpdateIdea = handleSubmit(async () => {
  router.push('/ideas')
})

const intervalId = setInterval(() => {
  if (overallRating.value) {
    clearInterval(intervalId)
  }

  if (initialOverallRating.value.includes('...')) {
    return (initialOverallRating.value = 'вычисление')
  }
  return (initialOverallRating.value += '.')
}, 200)
</script>

<template>
  <div class="combined-rating d-grid w-100">
    <div class="w-100 row row-cols-2">
      <div
        class="w-50 col-2 mb-2"
        v-for="(select, index) in ratingSelects"
        :key="index"
      >
        <Select
          :name="select.name"
          validate-on-update
          :label="select.label"
          :options="select.options"
          placeholder="Выберите значение"
        ></Select>
      </div>
    </div>

    <Typography class-name="fs-6 text-primary">
      Рейтинг: {{ overallRating || initialOverallRating }}
    </Typography>

    <ProgressBar
      v-if="overallRating"
      :value="overallRating"
      :max="5"
    />
    <LoadingPlaceholder v-else />
  </div>

  <Button
    type="submit"
    class-name="btn-primary"
    @click="handleUpdateIdea"
  >
    Утвердить
  </Button>
</template>

<style lang="scss" scoped>
.combined-rating {
  @include flexible(flex-start, flex-start, column, $gap: 8px);
}
</style>
