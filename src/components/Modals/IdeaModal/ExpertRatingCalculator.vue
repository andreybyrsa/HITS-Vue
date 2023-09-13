<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import {
  ExpertConfirmation,
  ratingSelects,
  ExperCalculatorProps,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const ideasStore = useIdeasStore()
const props = defineProps<ExperCalculatorProps>()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const initialOverallRating = ref('вычисление')
const { values, handleSubmit, setFieldValue } = useForm<ExpertConfirmation>({
  validationSchema: {
    rating: (value: number) => value > 0 || 'Поля не заполнены',
    marketValue: (value: number) => value > 0 || 'Поле не заполнено',
    originality: (value: number) => value > 0 || 'Поле не заполнено',
    technicalRealizability: (value: number) => value > 0 || 'Поле не заполнено',
    suitability: (value: number) => value > 0 || 'Поле не заполнено',
    budget: (value: number) => value > 0 || 'Поле не заполнено',
  },
})
const overallRating = computed(() => {
  const { marketValue, originality, technicalRealizability, suitability, budget } =
    values
  if (
    [marketValue, originality, technicalRealizability, suitability, budget].every(
      (value) => value > 0,
    )
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

const handleUpdateIdea = handleSubmit(async (values) => {
  const currentUser = user.value
  console.log(currentUser, props.idea)
  if (currentUser?.token && props.idea) {
    const { token, email } = currentUser
    const { id } = props.idea
    await ideasStore.confirmInitatorIdea(values, id, token, email)
  }
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
