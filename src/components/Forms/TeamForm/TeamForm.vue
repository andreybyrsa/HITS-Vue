<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import TeamType from '@Components/Forms/TeamForm/TeamType.vue'
import TeamVue from '@Components/Forms/TeamForm/Team.vue'
import Button from '@Components/Button/Button.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import { TeamFormProps } from '@Components/Forms/TeamForm/TeamForm.types'
import { User } from '@Domain/User'
import { Team, TeamSkills } from '@Domain/Team'
import TeamService from '@Services/TeamService'
import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { Skill } from '@Domain/Skill'

const props = defineProps<TeamFormProps>()

const isLoading = ref<boolean>(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()
const router = useRouter()
const stackTechnologies = ref<Skill[]>([])
const { handleSubmit, setValues } = useForm<Team>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    description: (value: string) => value?.length > 0 || 'Поле не заполнено',
    closed: (value: boolean) => value !== undefined || 'Тип команды не выбран',
    owner: (value: User) => value !== undefined || 'Поле не выбрано',
  },
  initialValues: {
    ...props.team,
  },
})
watchImmediate(
  () => props.team,
  async (team) => {
    if (team) {
      setValues({ ...team })
      const currentUser = user.value
      if (currentUser?.token) {
        const { token } = currentUser
        const { id } = team
        const response = await TeamService.getTeamSkills(id, token)
        if (response instanceof Error) {
          return notificationsStore.createSystemNotification(
            'Система',
            response.message,
          )
        }
        stackTechnologies.value = response.wantedSkills
      }
    }
  },
)

watchImmediate(
  () => stackTechnologies.value,
  async () => {
    const currentUser = user.value
    if (currentUser?.token && props.team) {
      const { token } = currentUser
      const { id } = props.team

      await saveTeamSkills(id, token, props.team)
    }
  },
)

const handleCreateTeam = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    values.membersCount = values.members.length
    values.createdAt = new Date().toJSON()

    isLoading.value = true
    const response = await TeamService.createTeam(values, token)
    isLoading.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    await saveTeamSkills(response.id, token, props.team)
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
    isLoading.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    router.push({ name: 'teams-list' })
  }
})
async function saveTeamSkills(
  teamId: string,
  token: string,
  team: Team | undefined,
) {
  const teamSkills = {
    teamId,
    skills: stackTechnologies.value,
    wantedSkills: stackTechnologies.value,
  } as TeamSkills
  if (team) {
    const teamSkillsResponse = await TeamService.updateTeamSkills(
      teamId,
      teamSkills,
      token,
    )
    if (teamSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        teamSkillsResponse.message,
      )
    }
  } else {
    const teamSkillsResponse = await TeamService.createTeamSkills(teamSkills, token)
    if (teamSkillsResponse instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        teamSkillsResponse.message,
      )
    }
  }
}
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
        <StackCategories v-model:stack="stackTechnologies" />
      </div>

      <TeamVue :mode="mode" />
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
</style>
