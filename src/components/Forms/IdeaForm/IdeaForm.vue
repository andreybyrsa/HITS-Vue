<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import CustomerAndContact from '@Components/Forms/IdeaForm/CustomerAndContact.vue'
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.types'
import PreAssessmentCalculator from '@Components/Forms/IdeaForm/PreAssessmentCalculator.vue'
import IdeaFormInputs from '@Components/Forms/IdeaForm/IdeaFormInputs.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import Button from '@Components/Button/Button.vue'

import { Idea, IdeaSkills } from '@Domain/Idea'
import { Skill } from '@Domain/Skill'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const notificationsStore = useNotificationsStore()

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const stackTechnologies = ref<Skill[]>([])
const ideaSkills = ref<Skill[]>()

const isSavingDraft = ref(false)
const isSendingOnApproval = ref(false)

const { values, setFieldValue, setValues, validateField, handleSubmit } =
  useForm<Idea>({
    validationSchema: {
      name: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      problem: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      solution: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      result: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      description: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      maxTeamSize: (value: number) =>
        (value && value >= 3 && value <= 7) || 'Значение должно быть от 3 до 7',
      minTeamSize: (value: number) =>
        (value && value >= 3 && value <= 7) || 'Значение должно быть от 3 до 7',

      customer: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      contactPerson: (value: string) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',

      suitability: (value: number) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      budget: (value: number) =>
        Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    },
    initialValues: {
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      status: 'NEW',
    },
  })

watchImmediate(
  () => props.idea,
  async (idea) => {
    if (idea) {
      setValues({ ...idea })

      const currentUser = user.value

      if (currentUser?.token) {
        const { token } = currentUser
        const { id } = idea
        const response = await IdeasService.getIdeaSkills(id, token)

        if (response instanceof Error) {
          return notificationsStore.createSystemNotification(
            'Система',
            response.message,
          )
        }

        ideaSkills.value = response.skills
      }
    }
  },
)

const handleSaveAndSendOnApproval = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isSendingOnApproval.value = true
    const ideaResponse = await IdeasService.saveAndSendIdeaOnApproval(
      { ...values, status: 'ON_APPROVAL' },
      token,
    )

    if (ideaResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        ideaResponse.message,
      )
    }

    await saveIdeaSkills(ideaResponse.id, token, props.idea)
    isSendingOnApproval.value = false

    router.push({ name: 'ideas-list' })
  }
})

const handleSaveDraftIdea = async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    const { valid } = await validateField('name')

    if (valid) {
      isSavingDraft.value = true
      const response = await IdeasService.saveIdeaDraft(values, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      await saveIdeaSkills(response.id, token, props.idea)
      isSavingDraft.value = false

      router.push({ name: 'ideas-list' })
    }
  }
}

async function saveIdeaSkills(
  ideaId: string,
  token: string,
  idea: Idea | undefined,
) {
  const ideaSkills = {
    ideaId,
    skills: stackTechnologies.value,
  } as IdeaSkills
  if (idea) {
    const ideaSkillsResponse = await IdeasService.updateIdeaSkills(
      ideaId,
      ideaSkills,
      token,
    )

    if (ideaSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        ideaSkillsResponse.message,
      )
    }
  } else {
    const ideaSkillsResponse = await IdeasService.createIdeaSkills(ideaSkills, token)

    if (ideaSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        ideaSkillsResponse.message,
      )
    }
  }
}
</script>

<template>
  <form class="idea-form p-3 bg-white w-100 h-100 overflow-auto">
    <Typography class-name="fs-2 text-primary">
      {{ title }}
    </Typography>

    <div class="w-75 d-flex flex-column gap-3">
      <IdeaFormInputs />

      <StackCategories
        :skills="ideaSkills"
        v-model:stack="stackTechnologies"
      />

      <CustomerAndContact
        :idea="values"
        @set-value="setFieldValue"
      />

      <PreAssessmentCalculator :idea="values" />

      <div class="idea-form__submit-buttons">
        <Button
          v-if="values.status !== 'ON_EDITING'"
          variant="primary"
          :is-loading="isSavingDraft"
          @click="handleSaveDraftIdea"
        >
          Сохранить черновик
        </Button>

        <Button
          variant="success"
          :is-loading="isSendingOnApproval"
          @click="handleSaveAndSendOnApproval"
        >
          Отправить на согласование
        </Button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.idea-form {
  @include flexible(center, flex-start, column, $gap: 12px);

  &__submit-buttons {
    @include flexible(center, center, $gap: 16px);
  }
}
</style>
