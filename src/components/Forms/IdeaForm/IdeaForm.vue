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
import IdeaFormSubmit from '@Components/Forms/IdeaForm/IdeaFormSubmit.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea, IdeaSkills } from '@Domain/Idea'
import { Skill } from '@Domain/Skill'

import IdeasService from '@Services/IdeasService'
import UsersGroupsService from '@Services/UsersGroupsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const stackTechnologies = ref<Skill[]>([])

const { values, setFieldValue, setValues, handleSubmit, validateField } =
  useForm<Idea>({
    validationSchema: {
      name: (value: string) => value?.length > 0 || 'Поле не заполнено',
      problem: (value: string) => value?.length > 0 || 'Поле не заполнено',
      solution: (value: string) => value?.length > 0 || 'Поле не заполнено',
      result: (value: string) => value?.length > 0 || 'Поле не заполнено',
      description: (value: string) => value?.length > 0 || 'Поле не заполнено',
      maxTeamSize: (value: string) => value || 'Поле не заполнено',
      minTeamSize: (value: string) => value || 'Поле не заполнено',

      customer: (value: string) => value?.length > 0 || 'Поле не заполнено',
      contactPerson: (value: string) => value?.length > 0 || 'Поле не заполнено',

      suitability: (value: number) => (value && value > 0) || 'Поле не заполнено',
      budget: (value: number) => (value && value > 0) || 'Поле не заполнено',
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

        stackTechnologies.value = response.skills
      }
    } else {
      const currentUser = user.value

      if (currentUser?.token) {
        const { token } = currentUser
        const response = await UsersGroupsService.getUsersGroups(token)

        if (response instanceof Error) {
          return notificationsStore.createSystemNotification(
            'Система',
            response.message,
          )
        }

        const experts = response.find((userGroup) =>
          userGroup.roles.includes('EXPERT'),
        )
        const projectOffice = response.find((userGroup) =>
          userGroup.roles.includes('PROJECT_OFFICE'),
        )
        if (experts && projectOffice) {
          setFieldValue('experts', experts)
          setFieldValue('projectOffice', projectOffice)
        } else {
          return notificationsStore.createSystemNotification(
            'Система',
            'Группы не подгружены',
          )
        }
      }
    }
  },
)

const handleSaveAndSendOnApproval = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
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

    router.push({ name: 'ideas-list' })
  }
})

const handleSaveDraftIdea = async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    const { valid } = await validateField('name')

    if (valid) {
      const response = await IdeasService.saveIdeaDraft(values, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      await saveIdeaSkills(response.id, token, props.idea)

      router.push({ name: 'ideas-list' })
    }
  }
}

async function saveIdeaSkills(
  ideaId: number,
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
  <FormLayout class-name="w-100 h-100 overflow-auto">
    <Typography class-name="fs-2 text-primary">
      {{ title }}
    </Typography>

    <div class="w-75 d-flex flex-column gap-3">
      <IdeaFormInputs @set-value="setFieldValue" />

      <StackCategories v-model:stack="stackTechnologies" />

      <CustomerAndContact
        :idea="values"
        @set-value="setFieldValue"
      />

      <PreAssessmentCalculator :idea="values" />

      <IdeaFormSubmit
        :idea="values"
        @on-send-on-approval="handleSaveAndSendOnApproval"
        @on-save-draft="handleSaveDraftIdea"
      />
    </div>
  </FormLayout>
</template>
