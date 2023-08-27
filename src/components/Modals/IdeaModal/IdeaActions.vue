<script lang="ts" setup>
import { ref, computed } from 'vue'
import getStatus from '@Utils/getStatus'
import getRoles from '@Utils/getRoles'
import { Idea, Risk } from '@Domain/Idea'
import RolesTypes from '@Domain/Roles'
import StatusTypes from '@Domain/IdeaStatus'
import Button from '@Components/Button/Button.vue'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import { ExpertRatingData } from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import { RatingData } from '@Components/Modals/IdeaModal/RatingCalculator.types'
import RatingCalculator from '@Components/Modals/IdeaModal/RatingCalculator.vue'
import CombinedRatingCalculator from '@Components/Modals/IdeaModal/CombinedRatingCalculator.vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import useNotification from '@Hooks/useNotification'

import IdeasService from '@Services/IdeasService'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

const ideasStore = useIdeasStore()
const userStore = useUserStore()
const availableRoles = getRoles()
const props = defineProps<{ role: RolesTypes; idea: Idea }>()
const status = getStatus()
const isExpert = computed(() => userStore.user?.role === 'EXPERT')
const desiredStatus = 'NEW'
const onConfirmation = computed(() => props.idea.status === desiredStatus)
const { user } = storeToRefs(userStore)
const router = useRouter()

const { values, handleSubmit } = useForm<Risk>({
  validationSchema: {
    risk: (value: string) => value?.length > 0 || 'Поле не заполнено',
    marketValue: (value: string) => value?.length > 0 || 'Поле не заполнено',
    originality: (value: string) => value?.length > 0 || 'Поле не заполнено',
    techniclFeasibility: (value: string) => value?.length > 0 || 'Поле не заполнено',
    understanding: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    ...props.idea,
  },
})

const {
  isOpenedNotification,
  notificationOptions,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const currentIdea = computed(() => ({
  ...values,
}))

const handleConfirmIdea = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    const response = await IdeasService.putExpertIdeas(values, id, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    router.push('/ideas')
  }
})

const ExpertratingData = ref<ExpertRatingData>({
  marketValue: props.idea?.realizability ?? 1,
  originality: props.idea?.suitability ?? 1,
  technicalFeasibility: props.idea?.budget ?? 1,
  understanding: props.idea?.budget ?? 1,
  rating: props.idea?.rating ?? 1,
})

const ratingData = ref<RatingData>({
  realizability: props.idea?.realizability ?? 1,
  suitability: props.idea?.suitability ?? 1,
  budget: props.idea?.budget ?? 1,
  rating: props.idea?.rating ?? 1,
})

const isExpertRatingDataValid = computed(() => {
  const { marketValue, originality, technicalFeasibility, understanding } =
    ExpertratingData.value
  return marketValue && originality && technicalFeasibility && understanding
})

const isRatingDataValid = computed(() => {
  const { realizability, suitability, budget } = ratingData.value
  return realizability && suitability && budget
})
</script>

<template>
  <div
    v-if="isExpert && onConfirmation"
    class="idea-actions"
  >
    <div class="calculator-container">
      <CombinedRatingCalculator
        :role="props.role"
        :idea="props.idea"
      />

      <div class="extra-gap"></div>
      <Button
        type="submit"
        class-name="btn-primary"
        @click="handleConfirmIdea"
        :disabled="!isExpertRatingDataValid || !isRatingDataValid"
        >Утвердить идею</Button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.extra-gap {
  margin-bottom: 20px;
}

.calculator-container {
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
