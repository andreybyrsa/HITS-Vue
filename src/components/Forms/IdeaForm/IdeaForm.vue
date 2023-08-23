<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import RatingCalculator from '@Components/Forms/IdeaForm/RatingCalculator.vue'
import CustomerAndContact from '@Components/Forms/IdeaForm/CustomerAndContact.vue'
import CustomerAndContactType from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.types'
import { RatingData } from '@Components/Forms/IdeaForm/RatingCalculator.types'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import IdeaFormInputs from '@Components/Forms/IdeaForm/IdeaFormInputs.vue'
import IdeaFormSubmit from '@Components/Forms/IdeaForm/IdeaFormSubmit.vue'

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

const projectType = ref({
  projectType: props.idea?.projectType ?? 'INSIDE',
})
const customerAndContact = ref<CustomerAndContactType>({
  customer: props.idea?.customer ?? 'ВШЦТ',
  contactPerson: props.idea?.contactPerson ?? 'ВШЦТ',
})
const ratingData = ref<RatingData>({
  realizability: props.idea?.realizability ?? 1,
  suitability: props.idea?.suitability ?? 1,
  budget: props.idea?.budget ?? 1,
  rating: props.idea?.rating ?? 1,
})

const { values, handleSubmit } = useForm<Idea>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    problem: (value: string) => value?.length > 0 || 'Поле не заполнено',
    solution: (value: string) => value?.length > 0 || 'Поле не заполнено',
    result: (value: string) => value?.length > 0 || 'Поле не заполнено',
    description: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    ...props.idea,
  },
})

const currentIdea = computed(() => ({
  ...values,
  ...projectType.value,
  ...customerAndContact.value,
  ...ratingData.value,
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

const handleDeleteIdea = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    const response = await IdeasService.deleteInitiatorIdea(id, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    router.push('/ideas')
  }
}
</script>

<template>
  <FormLayout class-name="w-100 h-100 overflow-auto">
    <Typography class-name="fs-2 text-primary">
      {{ title }}
    </Typography>

    <div class="w-75 d-flex flex-column gap-3">
      <IdeaFormInputs v-model="projectType.projectType" />

      <CustomerAndContact v-model="customerAndContact" />

      <RatingCalculator v-model="ratingData" />

      <IdeaFormSubmit
        :is-editing="!!idea"
        @on-submit="handlePostIdea"
        @on-update="handleUpdateIdea"
        @on-delete="handleDeleteIdea"
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
