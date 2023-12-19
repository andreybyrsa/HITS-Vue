<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'
import { useRouter } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import TeamType from '@Components/Forms/TeamForm/TeamType.vue'
import TeamVue from '@Components/Forms/TeamForm/Team.vue'
import Button from '@Components/Button/Button.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import { TeamFormProps } from '@Components/Forms/TeamForm/TeamForm.types'

import { User } from '@Domain/User'
import { Team, TeamMember, TeamInvitation } from '@Domain/Team'
import { Skill } from '@Domain/Skill'

import TeamService from '@Services/TeamService'

import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const props = defineProps<TeamFormProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()

const wantedSkills = ref<Skill[]>([])
const totalSkills = ref<Skill[]>([])
const stackTechnologies = ref<Skill[]>([])

const invitationUsers = ref<TeamMember[]>([])

const isLoading = ref<boolean>(false)

const { handleSubmit, setFieldValue, setValues } = useForm<Team>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    closed: (value: boolean) =>
      Validation.checkIsEmptyValue(value) || 'Тип команды не выбран',
    owner: (value: User) => Validation.checkIsEmptyValue(value) || 'Поле не выбрано',
    leader: (value: User) =>
      Validation.checkIsEmptyValue(value) || 'Поле не выбрано',
    members: (value: User[]) =>
      Validation.checkIsEmptyValue(value) || 'Участники не выбраны',
  },
})

watchImmediate(
  () => props.team,
  async (team) => {
    if (team) {
      setValues({ ...team })

      wantedSkills.value = team.wantedSkills
      totalSkills.value = team.skills
    }
  },
)

watchImmediate(stackTechnologies, (skills) => setFieldValue('wantedSkills', skills))

const handleCreateTeam = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    const response = await TeamService.createTeam(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    if (invitationUsers.value.length) {
      const invitationsToTeam = invitationUsers.value.map(
        ({ userId, email, firstName, lastName }) => ({
          teamId: response.id,
          userId,
          email,
          firstName,
          lastName,
        }),
      ) as TeamInvitation[]

      const responseInvitation = await TeamService.createInvitationsToTeam(
        invitationsToTeam,
        token,
      )

      if (responseInvitation instanceof Error) {
        notificationsStore.createSystemNotification(
          'Система',
          responseInvitation.message,
        )
      }
    }

    isLoading.value = false

    router.push({ name: 'teams-list' })
  }
})

const handleUpdateTeam = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.team) {
    const { token } = currentUser
    const { id } = props.team

    isLoading.value = true
    const response = await TeamService.updateTeam(values, id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    isLoading.value = false

    router.push({ name: 'teams-list' })
  }
})

const radarChartsSkills = computed<SkillsArea[]>(() => [
  {
    label: 'Желаемые компетенции',
    skills: stackTechnologies.value,
    alphaOpacity: 100,
  },
  {
    label: 'Фактические компетенции',
    skills: totalSkills.value,
    alphaOpacity: 50,
  },
])

watchImmediate(
  () => invitationUsers.value.length,
  () => {
    const skills: Skill[] = []
    invitationUsers.value.forEach((user) => {
      skills.push(...user.skills)
    })
    totalSkills.value = skills
  },
)
</script>

<template>
  <div class="team-form w-100 h-100 bg-white p-3 overflow-auto">
    <div class="team-form__content w-75">
      <Typography class-name="fs-2 text-primary">
        {{ props.team ? 'Редактирование команды' : 'Создание команды' }}
      </Typography>

      <Input
        name="name"
        class-name="rounded-end"
        label="Название команды*"
        validate-on-update
        placeholder="Введите название команды"
      />
      <Textarea
        name="description"
        class-name="rounded-end"
        label="Описание команды*"
        validate-on-update
        placeholder="Введите описание команды"
      ></Textarea>

      <TeamType />

      <div class="w-100 d-flex flex-column gap-3">
        <StackCategories
          :skills="wantedSkills"
          v-model:stack="stackTechnologies"
        />
      </div>

      <TeamVue
        :team="team"
        v-model="invitationUsers"
        @set-value="setFieldValue"
      />

      <SkillsRadarChart
        :skills="radarChartsSkills"
        :width="225"
        :height="225"
      />

      <Button
        v-if="props.team"
        variant="primary"
        :isLoading="isLoading"
        @click="handleUpdateTeam"
      >
        Сохранить изменения
      </Button>
      <Button
        v-else
        variant="success"
        :isLoading="isLoading"
        @click="handleCreateTeam"
      >
        Создать команду
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-form {
  @include flexible(flex-start, center);

  &__content {
    @include flexible(center, flex-start, column, $gap: 16px);
  }
}
.team-invite-form {
  width: 100%;
  @include flexible(start, start, column);

  &__main {
    width: 100%;
    @include flexible(start, start);
  }
}
</style>
