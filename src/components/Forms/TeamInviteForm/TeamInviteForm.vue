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
import { provide, ref } from 'vue'

import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'
import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { Skill } from '@Domain/Skill'
import TeamInviteSelectedUsers from './TeamInviteSelectedUsers.vue'
import TeamInviteSearchUsers from './TeamInviteSearchUsers.vue'
import { User } from '@Domain/User'

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
        name: 'Python',
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
    ],
  },
]

const selectedUsers = ref<User[]>([])

const users = ref<User[]>([
  {
    id: '0',
    token: '10296538',
    email: 'admin@mail.com',
    firstName: 'Админ',
    lastName: 'Админ',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '1',
    token: '613098',
    email: '1@mail.com',
    firstName: 'Пользователь',
    lastName: 'Пользователь',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '2',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '3',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '4',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '5',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
  {
    id: '6',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
  },
])

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
