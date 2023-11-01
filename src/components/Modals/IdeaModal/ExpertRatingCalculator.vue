<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'
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

import RatingService from '@Services/RatingService'

import useUserStore from '@Store/user/userStore'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const props = defineProps<ExperCalculatorProps>()
const ratings = defineModel<Rating[]>({ required: false })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const overallRatingPlaceholder = ref('Вычисление')

const isSavedRating = ref(false)

const { values, setFieldValue, setValues, handleSubmit } = useForm<Rating>({
  validationSchema: {
    rating: (value: number) => (value && value >= 0) || 'Поля не заполнены',
    marketValue: (value: number) => (value && value >= 0) || 'Поле не заполнено',
    originality: (value: number) => (value && value >= 0) || 'Поле не заполнено',
    technicalRealizability: (value: number) =>
      (value && value >= 0) || 'Поле не заполнено',
    suitability: (value: number) => (value && value >= 0) || 'Поле не заполнено',
    budget: (value: number) => (value && value >= 0) || 'Поле не заполнено',
  },
})

watchImmediate(
  () => props.rating,
  (currentRating) => {
    if (currentRating) {
      setValues({ ...currentRating })
    }
  },
)

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
    const response = await RatingService.confirmExpertRating(values, id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ratings.value?.forEach((rating) => {
      if (rating.id === values.id) {
        rating.confirmed = true
      }
    })
  }
})

const handleSaveRating = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    const response = await RatingService.saveExpertRating(values, id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

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
        class-name="btn-primary"
        @click="handleConfirmRating"
      >
        Утвердить
      </Button>
      <Button
        type="submit"
        :class-name="isSavedRating ? 'btn-success' : 'btn-primary'"
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
