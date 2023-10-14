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
import IdeaSkillsService from '@Services/IdeaSkills'

import useUserStore from '@Store/user/userStore'

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const stackTechnologies = ref<Skill[]>([])

const { values, setFieldValue, setValues, handleSubmit } = useForm<Idea>({
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
    createdAt: new Date(),
    modifiedAt: new Date(),
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
        const response = await IdeaSkillsService.getIdeaSkills(id, token)

        if (response instanceof Error) {
          return // notification
        }

        stackTechnologies.value = response.skills
      }
    } else {
      const currentUser = user.value

      if (currentUser?.token) {
        const { token } = currentUser
        const response = await UsersGroupsService.getUsersGroups(token)

        if (response instanceof Error) {
          return // notification
        }

        const experts = response.filter((userGroup) =>
          userGroup.roles.includes('EXPERT'),
        )
        const projectOffice = response.filter((userGroup) =>
          userGroup.roles.includes('PROJECT_OFFICE'),
        )
        setFieldValue('experts', experts)
        setFieldValue('projectOffice', projectOffice)
      }
    }
  },
)

const handlePostIdea = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const ideaResponse = await IdeasService.postInitiatorIdea(values, token)

    if (ideaResponse instanceof Error) {
      return // notification
    }

    const ideaSkills = {
      ideaId: ideaResponse.id,
      skills: stackTechnologies.value,
    } as IdeaSkills

    const ideaSkillsResponse = await IdeaSkillsService.createIdeaSkills(
      ideaResponse.id,
      ideaSkills,
      token,
    )

    if (ideaSkillsResponse instanceof Error) {
      // notification
    }

    router.push({ name: 'ideas-list' })
  }
})

const handleUpdateIdea = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    const ideaResponse = await IdeasService.putInitiatorIdea(values, id, token)

    if (ideaResponse instanceof Error) {
      return // notification
    }

    const ideaSkills = {
      ideaId: id,
      skills: stackTechnologies.value,
    } as IdeaSkills

    const ideaSkillsResponse = await IdeaSkillsService.updateIdeaSkills(
      id,
      ideaSkills,
      token,
    )

    if (ideaSkillsResponse instanceof Error) {
      // notification
    }

    router.push({ name: 'ideas-list' })
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

      <StackCategories v-model:stack="stackTechnologies" />

      <CustomerAndContact
        :idea="values"
        @set-value="setFieldValue"
      />

      <PreAssessmentCalculator :idea="values" />

      <IdeaFormSubmit
        :is-editing="!!idea"
        @on-submit="handlePostIdea"
        @on-update="handleUpdateIdea"
      />
    </div>
  </FormLayout>
</template>
