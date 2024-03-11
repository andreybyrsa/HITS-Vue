<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { Idea, IdeaSkills, Skill } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { IdeaService } from '@Service'
import { validation } from '@Utils'
import { IdeaForm } from '@Components/Forms/IdeaForm/IdeaForm.types'
import { hints } from '@Components/Forms/IdeaForm/IdeaFormInputs.types'
import Typography from '@Components/Typography/Typography.vue'
import CustomerAndContact from '@Components/Forms/IdeaForm/CustomerAndContact.vue'
import PreAssessmentCalculator from '@Components/Forms/IdeaForm/PreAssessmentCalculator.vue'
import IdeaFormInputs from '@Components/Forms/IdeaForm/IdeaFormInputs.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import Button from '@Components/Button/Button.vue'

const notificationsStore = useNotificationsStore()

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const stackTechnologies = ref<Skill[]>([])
const ideaSkills = ref<Skill[]>()

const isSavingDraft = ref(false)
const isSendingOnApproval = ref(false)
const isUpdatingByAdmin = ref(false)

const { values, setFieldValue, setValues, validateField, handleSubmit } =
  useForm<Idea>({
    validationSchema: {
      name: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      problem: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      solution: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      result: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      description: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      maxTeamSize: (value: number) =>
        (value && value >= 3 && value <= 7) || 'Значение должно быть от 3 до 7',
      minTeamSize: (value: number) =>
        (value && value >= 3 && value <= 7) || 'Значение должно быть от 3 до 7',

      customer: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      contactPerson: (value: string) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',

      suitability: (value: number) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
      budget: (value: number) =>
        validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    },
    initialValues: {
      status: 'NEW',
    },
  })

watchImmediate(
  () => props.idea,
  async (idea) => {
    if (idea) {
      setValues({ ...idea })

      const { id } = idea
      const response = await IdeaService.getSkills(id)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      ideaSkills.value = response[0].skills
    }
  },
)

const handleSaveAndSendOnApproval = handleSubmit(async (values) => {
  isSendingOnApproval.value = true
  const ideaResponse = await IdeaService.create({
    ...values,
    status: 'ON_APPROVAL',
  })

  if (ideaResponse instanceof Error) {
    return notificationsStore.createSystemNotification(
      'Система',
      ideaResponse.message,
    )
  }

  await saveIdeaSkills(ideaResponse.id, props.idea)
  isSendingOnApproval.value = false

  router.push({ name: 'ideas-list' })
})

const handleSaveDraftIdea = async () => {
  const { valid } = await validateField('name')

  if (valid) {
    isSavingDraft.value = true
    const response = await IdeaService.createDraft(values)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    await saveIdeaSkills(response.id, props.idea)
    isSavingDraft.value = false

    router.push({ name: 'ideas-list' })
  }
}

const handleUpdateIdeaByAdmin = async () => {
  isUpdatingByAdmin.value = true
  const response = await IdeaService.updateByAdmin(values, values.id)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  await saveIdeaSkills(values.id, props.idea)
  isUpdatingByAdmin.value = false

  router.push({ name: 'ideas-list' })
}

async function saveIdeaSkills(ideaId: string, idea: Idea | undefined) {
  const ideaSkills = {
    ideaId,
    skills: stackTechnologies.value,
  } as IdeaSkills
  if (idea) {
    const ideaSkillsResponse = await IdeaService.updateSkills(ideaId, ideaSkills)

    if (ideaSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        ideaSkillsResponse.message,
      )
    }
  } else {
    const ideaSkillsResponse = await IdeaService.createSkills(ideaSkills)

    if (ideaSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        ideaSkillsResponse.message,
      )
    }
  }
}

function checkSaveDraftButton() {
  return values.status !== 'ON_EDITING' && user.value?.role !== 'ADMIN'
}

function checkUpdateByAdminButton() {
  return values.id && user.value?.role === 'ADMIN'
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
        :hint="hints.stackCategories"
      />

      <CustomerAndContact
        :idea="values"
        @set-value="setFieldValue"
      />

      <PreAssessmentCalculator :idea="values" />

      <div class="idea-form__submit-buttons">
        <Button
          v-if="checkSaveDraftButton()"
          variant="primary"
          :is-loading="isSavingDraft"
          @click="handleSaveDraftIdea"
        >
          Сохранить черновик
        </Button>

        <Button
          v-if="user?.role !== 'ADMIN'"
          variant="success"
          :is-loading="isSendingOnApproval"
          @click="handleSaveAndSendOnApproval"
        >
          Отправить на согласование
        </Button>

        <Button
          v-if="checkUpdateByAdminButton()"
          variant="success"
          :is-loading="isUpdatingByAdmin"
          @click="handleUpdateIdeaByAdmin"
        >
          Сохранить изменения
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
