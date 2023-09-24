<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue'
import { useForm } from 'vee-validate'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import {
  RatingSelect,
  ratingSelects,
  ExperCalculatorProps,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import IdeasService from '@Services/IdeasService'
import { Rating } from '@Domain/Idea'
import RatingService from '@Services/RatingService'
import { watchImmediate } from '@vueuse/core'
const ideasStore = useIdeasStore()
const props = defineProps<ExperCalculatorProps>()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const initialOverallRating = ref('вычисление')
const { values, handleSubmit, setFieldValue, setValues } = useForm<Rating>({
  validationSchema: {
    rating: (value: number) => value >= 0 || 'Поля не заполнены',
    marketValue: (value: number) => value >= 0 || 'Поле не заполнено',
    originality: (value: number) => value >= 0 || 'Поле не заполнено',
    technicalRealizability: (value: number) => value >= 0 || 'Поле не заполнено',
    suitability: (value: number) => value >= 0 || 'Поле не заполнено',
    budget: (value: number) => value >= 0 || 'Поле не заполнено',
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
const handleConfirmRating = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await RatingService.confirmExpertRating(values, id, token)
  }
})
const handleSaveRating = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await RatingService.saveExpertRating(values, id, token)
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
const rating = ref<Rating>()
const ideaId = ref('')
function fetchExpertData(ideaId: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const responseData = {
        ideaId: '123',
        expert: 'changeemail970@gmail.com',
        rating: 5,
        technicalRealizability: 3,
        suitability: 5,
        budget: 4,
        marketValue: null,
        originality: 3,
        confirmed: false,
      }
      resolve(responseData)
    }, 1000)
  })
}
const isLoading = ref(false)

watchImmediate(
  () => props.idea,
  async (newIdea) => {
    if (newIdea) {
      const expertRating = (await fetchExpertData(newIdea.id)) as Rating
      rating.value = expertRating
      setValues({
        ...expertRating,
      })
      isLoading.value = true
    }
  },
)

function getCurrentTooltip(select: RatingSelect) {
  const selectValue = values[select.name]
  if (selectValue) {
    return select.options.find((option) => option.value === selectValue)?.label
  }
}
</script>
<template>
  <div class="bg-white rounded-3">
    <div class="bg-white rounded-3 p-3">
      <div class="combined-rating d-grid w-100">
        <div class="w-100 row row-cols-2">
          <div
            class="w-50 col-2 mb-2"
            v-for="(select, index) in ratingSelects"
            :key="index"
          >
            <Select
              v-if="rating"
              :name="select.name"
              validate-on-update
              :label="select.label"
              :options="select.options"
              v-tooltip="getCurrentTooltip(select)"
              placeholder="Выберите значение"
              :disabled="rating?.confirmed"
            ></Select>
            <LoadingPlaceholder
              v-else
              height="small"
            />
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
      <div class="extra-gap"></div>
      <div
        class="button-container"
        v-if="!rating?.confirmed"
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
          class-name="btn-primary"
          @click="handleSaveRating"
        >
          Сохранить форму
        </Button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.combined-rating {
  @include flexible(flex-start, stretch, column, $gap: 8px);
}
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.extra-gap {
  margin-bottom: 16px;
}
.bg-white {
  background-color: white;
}

.rounded-3 {
  border-radius: 1rem;
}

.p-3 {
  padding: 1rem;
}
</style>
