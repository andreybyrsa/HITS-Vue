<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue'
import { useForm } from 'vee-validate'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import {
  ExpertConfirmation,
  ratingSelects,
  ExperCalculatorProps,
  ExpertData,
} from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
import Button from '@Components/Button/Button.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import IdeasService from '@Services/IdeasService'
const ideasStore = useIdeasStore()
const props = defineProps<ExperCalculatorProps>()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const initialOverallRating = ref('вычисление')
const { values, handleSubmit, setFieldValue, setValues } =
  useForm<ExpertConfirmation>({
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
const handleUpdateIdea = handleSubmit(async (values) => {
  const currentUser = user.value
  console.log(currentUser, props.idea)
  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await IdeasService.putExpertIdea(values, id, token)
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
const ideaId = ref('123')
const expertRatings = ref<ExpertData[]>([])
function fetchExpertData(ideaId: string | Ref<string>) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const responseData = [
        {
          ideaId: '123',
          expert: 'changeemail970@gmail.com',
          rating: 5,
          technicalRealizability: 3,
          suitability: 5,
          budget: 4,
          marketValue: 4,
          originality: 3,
          confirmed: false, //False
        },
      ]
      const expertData = responseData.find(
        (expertData) =>
          expertData.ideaId === (typeof ideaId === 'string' ? ideaId : ideaId.value),
      )
      if (expertData) {
        if (expertData.confirmed === false) {
          console.log('TechnicalRealizability:', expertData.technicalRealizability)
          console.log('Suitability:', expertData.suitability)
          console.log('Budget:', expertData.budget)
          console.log('MarketValue:', expertData.marketValue)
          console.log('Originality:', expertData.originality)
        } else {
          console.log('True')
        }
        resolve(expertData)
      } else {
        reject('Нет информации об экспертах для данной идеи')
      }
    }, 1000)
  })
}
fetchExpertData(ideaId)
  .then((experts) => {
    console.log('Информация об эксперте:', experts)
  })
  .catch((error) => {
    console.error('Ошибка вывода', error)
  })
function hasExpertRatedIdea(experts: ExpertData[] | unknown) {
  if (Array.isArray(experts)) {
    const currentUser = user.value
    if (currentUser?.token && props.idea) {
      const expertRating = experts.find(
        (expert) => expert.expert === currentUser.email,
      )
      if (!expertRating) {
        return 'noRating'
      } else if (expertRating.rating === null) {
        return 'ratedWithoutValue'
      } else {
        return 'rated'
      }
    }
  }
  return 'noRating'
}
const displayFormValues = computed(() => {
  const experts = expertRatings.value
  const ratingStatus = hasExpertRatedIdea(experts)
  return ratingStatus === 'noRating' || ratingStatus === 'ratedWithoutValue'
})
const handleApprove = () => {
  const expertRatingObj: ExpertData = {
    ideaId: props.idea.id,
    marketValue: values.marketValue,
    originality: values.originality,
    technicalRealizability: values.technicalRealizability,
    suitability: values.suitability,
    budget: values.budget,
    rating: values.rating,
    expert: '',
  }
  expertRatings.value.push(expertRatingObj)
}
const previousRatings = computed(() => {
  const experts = expertRatings.value
  const currentUser = user.value
  if (currentUser?.token && props.idea) {
    return experts.find((expert) => expert.expert === currentUser.email)
  }
  return null
})
// watch(
//   () => props.idea,
//   (newIdea) => {
//     if (newIdea) {
//       fetchExpertData(newIdea.id)
//         .then((experts) => {
//           hasExpertRatedIdea(experts)
//           if (previousRatings.value && previousRatings.value.rating === null) {
//             setValues({
//               marketValue: previousRatings.value.marketValue,
//               originality: previousRatings.value.originality,
//               technicalRealizability: previousRatings.value.technicalRealizability,
//               suitability: previousRatings.value.suitability,
//               budget: previousRatings.value.budget,
//               rating: previousRatings.value.rating,
//             })
//           }
//         })
//         .catch((error) => {
//           console.error('Ошибка вывода', error)
//         })
//     }
//   },
// )
const rating = ref({
  ideaId: '',
  expert: '',
  marketValue: 1,
  originality: 2,
  technicalRealizability: 1,
  suitability: 1,
  budget: 1,
  rating: 5,
  confirmed: true,
})
watch(
  () => rating.value,
  (newRating) => {
    if (newRating) {
      setValues({
        marketValue: newRating.marketValue,
        originality: newRating.originality,
        technicalRealizability: newRating.technicalRealizability,
        suitability: newRating.suitability,
        budget: newRating.budget,
        rating: newRating.rating,
      })
    }
  },
)
watch(
  () => rating.value,
  (newRating) => {
    if (newRating && newRating.confirmed) {
      ratingSelects.forEach((select) => {
        select.value = newRating[select.name]
      })
    }
  },
)
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
          v-model="select.value"
          :disabled="rating.confirmed"
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
  <div class="button-container">
    <Button
      v-if="displayFormValues && !rating.confirmed"
      type="submit"
      class-name="btn-primary"
      @click="handleUpdateIdea"
      :disabled="rating.confirmed"
    >
      Утвердить
    </Button>
    <Button
      type="submit"
      class-name="btn-primary"
      @click="handleApprove"
      :disabled="rating.confirmed"
    >
      Сохранить форму
    </Button>
  </div>
  <!-- <div>
    {{ idea.id }}
  </div> -->
</template>
<style lang="scss" scoped>
.combined-rating {
  @include flexible(flex-start, flex-start, column, $gap: 8px);
}
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
