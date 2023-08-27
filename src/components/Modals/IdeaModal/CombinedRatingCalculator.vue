<script setup lang="ts">
import { ref, computed } from 'vue'
import ExpertRatingCalculator from './ExpertRatingCalculator.vue'
import RatingCalculator from './RatingCalculator.vue'
import { ExpertRatingData } from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import { RatingData } from '@Components/Modals/IdeaModal/RatingCalculator.types'
import Typography from '@Components/Typography/Typography.vue'

const expertRatingData = ref<ExpertRatingData>({
  marketValue: -1,
  originality: -1,
  technicalFeasibility: -1,
  understanding: -1,
  rating: -1,
})

const ratingData = ref<RatingData>({
  realizability: -1,
  suitability: -1,
  budget: -1,
  rating: -1,
})

const initialOverallRating = '1'

const overallRating = computed(() => {
  if (
    expertRatingData.value.marketValue === -1 &&
    expertRatingData.value.originality === -1 &&
    expertRatingData.value.technicalFeasibility === -1 &&
    expertRatingData.value.understanding === -1 &&
    ratingData.value.realizability === -1 &&
    ratingData.value.suitability === -1 &&
    ratingData.value.budget === -1
  ) {
    return initialOverallRating
  }

  const expertRatingSum =
    expertRatingData.value.marketValue +
    expertRatingData.value.originality +
    expertRatingData.value.technicalFeasibility +
    expertRatingData.value.understanding
  const ratingSum =
    ratingData.value.realizability +
    ratingData.value.suitability +
    ratingData.value.budget

  const expertRating = expertRatingSum !== -4 ? expertRatingSum / 4 : 0
  const rating = ratingSum !== -3 ? ratingSum / 3 : 0

  return ((expertRating + rating) / 2).toFixed(2).toString()
})

const progressBarStyle = computed(() => {
  const width = (parseFloat(overallRating.value) / 5) * 100

  if (parseFloat(overallRating.value) < 3) {
    return {
      width: `${width}%`,
      backgroundColor: '#dc3545',
    }
  } else if (
    parseFloat(overallRating.value) >= 3 &&
    parseFloat(overallRating.value) <= 4
  ) {
    return {
      width: `${width}%`,
      backgroundColor: '#ffc107',
    }
  } else {
    return {
      width: `${width}%`,
      backgroundColor: '#28a745',
    }
  }
})
</script>

<template>
  <div class="calculator-container">
    <ExpertRatingCalculator v-model="expertRatingData" />
    <div class="extra-gap"></div>
    <RatingCalculator v-model="ratingData" />
    <div class="extra-gap"></div>

    <div class="combined-rating">
      <Typography class-name="fs-6 text-primary">
        Рейтинг: {{ overallRating }}
      </Typography>
      <div class="progress">
        <div
          class="progress-bar"
          :style="progressBarStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-container {
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
}

.extra-gap {
  margin-bottom: 25px;
}

.combined-rating {
  margin-top: 10px;
  font-weight: bold;
}
</style>
