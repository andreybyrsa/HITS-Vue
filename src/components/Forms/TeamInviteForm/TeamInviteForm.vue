<template>
  <div class="team-invite-form">
    <TeamInviteSelectedUsers @removeUser="removeUser" />

    <div class="team-invite-form__main">
      <TeamInviteSearchUsers @addUser="addUser" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, provide, ref } from 'vue'

import TeamInviteSelectedUsers from './TeamInviteSelectedUsers.vue'
import TeamInviteSearchUsers from './TeamInviteSearchUsers.vue'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import ManageUsersService from '@Services/ManageUsersService'
import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import SkillsService from '@Services/SkillsService'
import UsersSkills from '@Domain/UsersSkills'

const notificationsStore = useNotificationsStore()

const selectedUsers = ref<User[]>([])

const users = ref<User[]>([])
const usersSkills = ref<UsersSkills[]>([])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

provide('selectedUsers', selectedUsers)
provide('users', users)
provide('usersSkills', usersSkills)

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

    const profileParallelRequests = [
      () => ManageUsersService.getUsers(token),
      () => SkillsService.getAllUsersSkills(token),
    ]

    await makeParallelRequests<User[] | UsersSkills[] | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, users)
        } else if (response.id === 1) {
          checkResponseStatus(response, usersSkills)
        }
      })
    })
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
