<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import {
  RatingSelect,
  ratingSelects,
  ExperCalculatorProps,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'
import ExpertRatingCalculatorPlaceholder from '@Components/Modals/IdeaModal/ExpertRatingCalculatorPlaceholder.vue'

import { Rating } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useRatingsStore from '@Store/ratings/ratingsStore'

import Validation from '@Utils/Validation'

const props = defineProps<ExperCalculatorProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ratingsStore = useRatingsStore()
const rating = ref<Rating>()

const overallRatingPlaceholder = ref('Вычисление')

const isSavedRating = ref(false)
const isSaving = ref(false)
const isConfirming = ref(false)

const { values, setFieldValue, setValues, handleSubmit } = useForm<Rating>({
  validationSchema: {
    rating: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поля не заполнены',
    marketValue: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    originality: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    technicalRealizability: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    suitability: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    budget: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

onMounted(() => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { idea } = props
    const { id } = currentUser

    const currentRating = ratingsStore.getRatingByIdeaIdAndExpertId(idea.id, id)

    if (currentRating) {
      setValues({ ...currentRating }, false)
      rating.value = currentRating
    }
  }
})

const overallRating = computed(() => {
  const { marketValue, originality, technicalRealizability, suitability, budget } =
    values

  if (
    marketValue &&
    originality &&
    technicalRealizability &&
    suitability &&
    budget
  ) {
    const expertRatingSum =
      marketValue + originality + technicalRealizability + suitability + budget

    return +(expertRatingSum / 5).toFixed(1)
  }

  return NaN
})

watch(overallRating, () => {
  setFieldValue('rating', overallRating.value)
})

const handleConfirmRating = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.idea

    isConfirming.value = true
    await ratingsStore.confirmRating(values, id, token)
    isConfirming.value = false
  }
})

const handleSaveRating = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea

    isSaving.value = true
    await ratingsStore.saveRating(values, id, token)
    isSaving.value = false

    isSavedRating.value = true
  }
}

const intervalId = setInterval(() => {
  if (overallRating.value) {
    clearInterval(intervalId)
  }
  if (overallRatingPlaceholder.value.includes('...')) {
    return (overallRatingPlaceholder.value = 'вычисление')
  }
  return (overallRatingPlaceholder.value += '.')
}, 200)

function getCurrentTooltip(select: RatingSelect) {
  const selectValue = values[select.name]
  if (selectValue) {
    return select.options.find((option) => option.value === selectValue)?.label
  }
}
</script>

<template>
  <div
    v-if="rating"
    class="combined-rating bg-white rounded-3 p-3 d-grid w-100"
  >
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
          v-tooltip="getCurrentTooltip(select)"
          placeholder="Выберите значение"
          :disabled="rating.confirmed"
        ></Select>
      </div>
    </div>

    <Typography class-name="fs-6 text-primary">
      Рейтинг: {{ overallRating || overallRatingPlaceholder }}
    </Typography>
    <ProgressBar
      v-if="overallRating"
      :value="overallRating"
      :max="5"
    />
    <LoadingPlaceholder v-else />

    <div
      class="d-flex gap-3"
      v-if="!rating.confirmed"
    >
      <Button
        type="submit"
        variant="primary"
        :is-loading="isConfirming"
        @click="handleConfirmRating"
      >
        Утвердить
      </Button>
      <Button
        type="submit"
        :variant="isSavedRating ? 'success' : 'primary'"
        :is-loading="isSaving"
        @click="handleSaveRating"
      >
        Сохранить форму
      </Button>
    </div>
  </div>

  <ExpertRatingCalculatorPlaceholder v-else />
</template>

<style lang="scss" scoped>
.combined-rating {
  @include flexible(flex-start, stretch, column, $gap: 8px);
}
</style>
