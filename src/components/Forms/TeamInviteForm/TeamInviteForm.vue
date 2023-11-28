<template>
  <div class="team-invite-form">
    <TeamInviteSelectedUsers @removeUser="removeUser" />

    <div class="team-invite-form__main">
      <TeamInviteSearchUsers @addUser="addUser" />

      <div class="w-25">
        <SkillsRadarChart
          label="Members"
          :skills="radarSkills"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, provide, ref } from 'vue'

import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'
import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import TeamInviteSelectedUsers from './TeamInviteSelectedUsers.vue'
import TeamInviteSearchUsers from './TeamInviteSearchUsers.vue'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import ManageUsersService from '@Services/ManageUsersService'
import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const radarSkills: SkillsArea[] = [
  {
    label: 'Members',
    skills: [
      {
        id: '0',
        name: 'JavaScript',
        type: 'LANGUAGE',
        confirmed: true,
      },
      {
        id: '1',
        name: 'React',
        type: 'FRAMEWORK',
        confirmed: true,
      },
      {
        id: '2',
        name: 'Rust',
        type: 'DATABASE',
        confirmed: true,
      },
      {
        id: '3',
        name: 'Swift',
        type: 'DEVOPS',
        confirmed: true,
      },
      {
        id: '4',
        name: 'Python',
        type: 'LANGUAGE',
        confirmed: true,
      },
      {
        id: '5',
        name: 'VueJS',
        type: 'FRAMEWORK',
        confirmed: true,
      },
      {
        id: '6',
        name: 'SQL',
        type: 'DATABASE',
        confirmed: true,
      },
      {
        id: '7',
        name: 'Docker',
        type: 'DEVOPS',
        confirmed: true,
      },
      {
        id: '8',
        name: 'C++',
        type: 'LANGUAGE',
        confirmed: true,
      },
      {
        id: '9',
        name: 'Angular',
        type: 'FRAMEWORK',
        confirmed: true,
      },
      {
        id: '10',
        name: 'Node',
        type: 'DATABASE',
        confirmed: true,
      },
      {
        id: '11',
        name: 'Dev',
        type: 'DEVOPS',
        confirmed: true,
      },
    ],
    alphaOpacity: 50,
  },
]

const notificationsStore = useNotificationsStore()

const selectedUsers = ref<User[]>([])

const users = ref<User[]>([])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

provide('selectedUsers', selectedUsers)
provide('users', users)

const addUser = (user: User) => {
  users.value = users.value.filter((u) => u.id !== user.id)
  selectedUsers.value.push(user)
}

const removeUser = (user: User) => {
  selectedUsers.value = selectedUsers.value.filter((u) => u.id !== user.id)
  users.value.push(user)
}

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const profileParallelRequests = [() => ManageUsersService.getUsers(token)]

    await makeParallelRequests<User[] | Error>(profileParallelRequests).then(
      (responses) => {
        responses.forEach((response) => {
          if (response.id === 0) {
            checkResponseStatus(response, users)
          }
        })
      },
    )
  }
})
</script>

<style lang="scss" scoped>
.team-invite-form {
  width: 100%;
  @include flexible(start, start, column, $gap: 16px);

  &__main {
    width: 100%;
    @include flexible(start, start, $gap: 16px);
  }
}
</style>
