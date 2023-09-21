<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import CustomerAndContact from '@Components/Forms/IdeaForm/CustomerAndContact.vue'
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.types'
import PreAssessmentCalculator from '@Components/Forms/IdeaForm/PreAssessmentCalculator.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import IdeaFormInputs from '@Components/Forms/IdeaForm/IdeaFormInputs.vue'
import IdeaFormSubmit from '@Components/Forms/IdeaForm/IdeaFormSubmit.vue'
import StackCategories from '@Components/Forms/IdeaForm/StackCategories.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import IdeasService from '@Services/IdeasService'

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const {
  isOpenedNotification,
  notificationOptions,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const stackTechnologies = ref({
  stack: props.idea?.stack ?? [],
})
const preAssessment = ref({
  preAssessment: props.idea?.preAssessment ?? 1,
})

const { values, setFieldValue, handleSubmit } = useForm<Idea>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    projectType: (value: string) => value?.length > 0 || 'Поле не заполнено',
    problem: (value: string) => value?.length > 0 || 'Поле не заполнено',
    solution: (value: string) => value?.length > 0 || 'Поле не заполнено',
    result: (value: string) => value?.length > 0 || 'Поле не заполнено',
    description: (value: string) => value?.length > 0 || 'Поле не заполнено',

    customer: (value: string) => value?.length > 0 || 'Поле не заполнено',
    contactPerson: (value: string) => value?.length > 0 || 'Поле не заполнено',

    technicalRealizability: (value: number) =>
      (value && value > 0) || 'Поле не заполнено',
    suitability: (value: number) => (value && value > 0) || 'Поле не заполнено',
    budget: (value: number) => (value && value > 0) || 'Поле не заполнено',
  },
  initialValues: {
    customer: 'ВШЦТ',
    contactPerson: 'ВШЦТ',
    ...props.idea,
  },
})

const currentIdea = computed(() => ({
  ...values,
  ...stackTechnologies.value,
  ...preAssessment.value,
}))

const handlePostIdea = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await IdeasService.postInitiatorIdea(currentIdea.value, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    router.push('/ideas')
  }
})

const handleUpdateIdea = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    const response = await IdeasService.putInitiatorIdea(
      currentIdea.value,
      id,
      token,
    )

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    router.push('/ideas')
  }
})
</script>

<template>
  <FormLayout class-name="w-100 h-100 overflow-auto">
    <Typography class-name="fs-2 text-primary">
      {{ title }}
    </Typography>

    <div class="w-75 d-flex flex-column gap-3">
      <IdeaFormInputs />

      <StackCategories v-model="stackTechnologies.stack" />

      <CustomerAndContact
        :idea="values"
        @set-value="setFieldValue"
      />

      <PreAssessmentCalculator
        :idea="values"
        v-model="preAssessment"
      />

      <IdeaFormSubmit
        :is-editing="!!idea"
        @on-submit="handlePostIdea"
        @on-update="handleUpdateIdea"
      />
    </div>

    <NotificationModal
      :type="notificationOptions.type"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
    >
      {{ notificationOptions.message }}
    </NotificationModal>
  </FormLayout>
</template>
