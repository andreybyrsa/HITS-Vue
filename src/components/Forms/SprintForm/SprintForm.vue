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
import { SprintFormProps } from '@Components/Forms/SprintForm/SprintForm.types'

import { User } from '@Domain/User'
import { Team, TeamMember, TeamInvitation } from '@Domain/Team'
import { Skill } from '@Domain/Skill'

import TeamService from '@Services/TeamService'

import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'
import { Sprint, Task } from '@Domain/Project'
import TaskForSprintForm from './TaskForSprintForm.vue'

import { tasksMocks } from '@Utils/getMocks'

const props = defineProps<SprintFormProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// const notificationsStore = useNotificationsStore()

// const router = useRouter()

const wantedSkills = ref<Skill[]>([])
const totalSkills = ref<Skill[]>([])
const stackTechnologies = ref<Skill[]>([])

const invitationUsers = ref<TeamMember[]>([])

const isLoading = ref<boolean>(false)

const { handleSubmit, setFieldValue, setValues } = useForm<Sprint>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    goal: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    startDate: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    finishDate: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    workingHours: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

watchImmediate(
  () => props.sprint,
  async (sprint) => {
    if (sprint) {
      setValues({ ...sprint })

      // wantedSkills.value = team.wantedSkills
      // totalSkills.value = team.skills
    }
  },
)

// watchImmediate(stackTechnologies, (skills) => setFieldValue('wantedSkills', skills))

const handleCreateTeam = handleSubmit(async (values) => {
  // const currentUser = user.value
  // if (currentUser?.token) {
  //   const { token } = currentUser
  //   isLoading.value = true
  //   const response = await TeamService.createTeam(values, token)
  //   if (response instanceof Error) {
  //     return notificationsStore.createSystemNotification('Система', response.message)
  //   }
  //   if (invitationUsers.value.length) {
  //     const invitationsToTeam = invitationUsers.value.map(
  //       ({ userId, email, firstName, lastName }) => ({
  //         teamId: response.id,
  //         userId,
  //         email,
  //         firstName,
  //         lastName,
  //       }),
  //     ) as TeamInvitation[]
  //     const responseInvitation = await TeamService.createInvitationsToTeam(
  //       invitationsToTeam,
  //       token,
  //     )
  //     if (responseInvitation instanceof Error) {
  //       notificationsStore.createSystemNotification(
  //         'Система',
  //         responseInvitation.message,
  //       )
  //     }
  //   }
  //   isLoading.value = false
  //   router.push({ name: 'teams-list' })
  // }
})

const handleUpdateTeam = handleSubmit(async (values) => {
  // const currentUser = user.value
  // if (currentUser?.token && props.team) {
  //   const { token } = currentUser
  //   const { id } = props.team
  //   isLoading.value = true
  //   const response = await TeamService.updateTeam(values, id, token)
  //   if (response instanceof Error) {
  //     return notificationsStore.createSystemNotification('Система', response.message)
  //   }
  //   isLoading.value = false
  //   router.push({ name: 'teams-list' })
  // }
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
  <div class="team-form w-100 bg-white p-3 overflow-auto">
    <div class="left-block width-auto">
      <div class="form-name">
        <Typography class-name="fs-3 text-primary">Создание спринта</Typography>
      </div>

      <div class="tasks">
        <div class="backlog">
          <div class="backlog-name border-bottom border-4">
            <Typography class-name="fs-4 text-secondary">Бэклог</Typography>
          </div>
          <div class="tasks-list d-flex flex-column gap-2">
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
            <TaskForSprintForm :task="tasksMocks[0]" />
          </div>
        </div>
        <div class="new-sprint">
          <div class="new-sprint-name border-bottom border-4">
            <Typography class-name="fs-4 text-secondary">Новый спринт</Typography>
          </div>
        </div>
      </div>
    </div>
    <div class="right-block">
      <div class="form">
        <Input
          name="name"
          class-name="rounded-end"
          label="Название спринта"
          validate-on-update
          placeholder="Введите название спринта"
        />
        <Textarea
          name="goal"
          class-name="rounded-end"
          label="Цель"
          validate-on-update
          placeholder="Введите цель спринта"
        ></Textarea>

        <Input
          name="startDate"
          class-name="rounded-end"
          label="Начало спринта"
          type="date"
          validate-on-update
          placeholder=".. | .. | .."
        />
        <Input
          name="finishDate"
          class-name="rounded-end"
          label="Конец спринта"
          type="date"
          validate-on-update
          placeholder=".. | .. | .."
        />
        <Input
          name="workingHours"
          class-name="rounded-end"
          label="Общие часы работы"
          type="number"
          validate-on-update
          placeholder="Часы"
        />
      </div>

      <Button
        v-if="props.sprint"
        variant="primary"
        class-name="w-75"
        :isLoading="isLoading"
        @click="handleUpdateTeam"
      >
        Сохранить изменения
      </Button>
      <Button
        v-else
        variant="primary"
        class-name="w-75"
        :isLoading="isLoading"
        @click="handleCreateTeam"
      >
        Создать спринт
      </Button>
    </div>
    <!-- <div class="team-form__content w-75"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.tasks-list {
  display: flex;
  padding: 7px 0;
}
.left-block {
  display: flex;
  justify-content: start;
  flex-direction: column;
  width: 66.66%;
  padding: 0 3rem;
}

.line {
  width: 11px;
  height: auto;
  background-color: gray;
}

.right-block {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form {
  display: grid;
  gap: 1rem;
}

.form-name {
  margin-bottom: 2rem;
}

.tasks {
  width: auto;
  display: flex;
  justify-content: space-between;
  overflow-y: scroll;
  padding: 0 10px;
}

.backlog {
  width: 45%;
}

.new-sprint {
  width: 45%;
}

.team-form {
  display: flex;
  justify-content: space-between;
  border-color: gray;
  height: 100%;
  // @include flexible(flex-start, center);

  // &__content {
  //   @include flexible(center, flex-start, column, $gap: 16px);
  // }
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
