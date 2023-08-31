<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import { ExpertConfirmation } from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import RatingCalculator from '@Components/Modals/IdeaModal/RatingCalculator.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'

const router = useRouter()

const initialOverallRating = ref('вычисление')

const { values, handleSubmit } = useForm<ExpertConfirmation>({
  validationSchema: {
    marketValue: (value: number) => value > 0 || 'Поле не заполнено',
    originality: (value: number) => value > 0 || 'Поле не заполнено',
    technicalFeasibility: (value: number) => value > 0 || 'Поле не заполнено',
    understanding: (value: number) => value > 0 || 'Поле не заполнено',

    realizability: (value: number) => value > 0 || 'Поле не заполнено',
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
    console.log(expertRatingSum / 7)
    return +(expertRatingSum / 7).toFixed(1)
  }

  return NaN
})

const handleUpdateIdea = handleSubmit(async () => {
  router.push('/ideas')
})
</script>

<template>
  <div class="combined-rating w-100">
    <div class="d-flex gap-3">
      <ExpertRatingCalculator />
      <RatingCalculator />
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
