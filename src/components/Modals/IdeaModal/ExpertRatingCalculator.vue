<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  ratingSelects,
  ExpertRatingData,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
const ratingData = defineModel<ExpertRatingData>({
  required: true,
})
const totalRating = computed(() => {
  const { marketValue, originality, technicalFeasibility, understanding } =
    ratingData.value
  const rating = +(
    (+marketValue + +originality + +technicalFeasibility + +understanding) /
    4
  ).toFixed(1)
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
        :options="select.choices"
        v-model="ratingData[select.key]"
        :default-value="0"
      ></Select>
    </div>
  </div>
</template>
