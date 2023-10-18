<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import TeamType from '@Components/Forms/TeamForm/TeamType.vue'
import TeamVue from '@Components/Forms/TeamForm/Team.vue'
import Button from '@Components/Button/Button.vue'
import { TeamFormProps } from '@Components/Forms/TeamForm/TeamForm.types'

import { User } from '@Domain/User'
import Team from '@Domain/Team'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'

const props = defineProps<TeamFormProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const { handleSubmit } = useForm<Team>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    description: (value: string) => value?.length > 0 || 'Поле не заполнено',
    closed: (value: boolean) => value !== undefined || 'Тип команды не выбран',
    owner: (value: User) => value !== undefined || 'Поле не выбрано',
    leader: (value: User) => value !== undefined || 'Поле не выбрано',
    members: (value: User[]) => value?.length > 0 || 'Участники не выбраны',
  },
  initialValues: {
    ...props.team,
  },
})
import useNotificationsStore from '@Store/notifications/notificationsStore'
const notificationsStore = useNotificationsStore()
import NotificationMiddleware from '@Middlewares/NotificationMiddleware.vue'

const handleCreateTeam = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.createTeam(values, token)

    if (response instanceof Error) {
      return
    }
    notificationsStore.createSystemNotification('Система', 'Группа успешно создана')
    console.log(NotificationMiddleware)
    router.push({ name: 'teams-list' })
  }
})

const handleUpdateTeam = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.team) {
    const { token } = currentUser
    const { id } = props.team
    const response = await TeamService.updateTeam(values, id, token)

    if (response instanceof Error) {
      return
    }

    router.push({ name: 'teams-list' })
  }
})
</script>

<template>
  <div class="team-form bg-white p-3">
    <div class="team-form__content w-75 h-100">
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

      <TeamVue />

      <Button
        v-if="props.team"
        class-name="btn-primary px-4"
        @click="handleUpdateTeam"
      >
        Сохранить изменения
      </Button>
      <Button
        v-else
        class-name="btn-primary px-4"
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
