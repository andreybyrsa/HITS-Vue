<template>
  <div class="team-invite-form w-75 p-2 border rounded">
    <!-- <TeamInviteSelectedUsers @removeUser="removeUser" />

    <div class="team-invite-form__main">
      <TeamInviteSearchUsers @addUser="addUser" />
    </div> -->
    <UsersInviteTable
      :users="users"
      :skills="skills"
      :users-skills="usersSkills"
    />
    <Button
      variant="light"
      class="w-100 rounded-bottom-2 rounded-top-0 border p-3 text-primary"
      prepend-icon-name="bi bi-plus-circle-fill"
    >
      Пригласить на портал
    </Button>
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
import Button from '@Components/Button/Button.vue'

import UsersInviteTable from '@Components/Tables/UsersInviteTable/UsersInviteTable.vue'
import { Skill } from '@Domain/Skill'

const notificationsStore = useNotificationsStore()

const selectedUsers = ref<User[]>([])

const invitationUsers = defineModel<User[]>({ required: true })

const users = ref<User[]>([])
const usersSkills = ref<UsersSkills[]>([])
const skills = ref<Skill[]>([])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

provide('selectedUsers', selectedUsers)
provide('users', users)
provide('usersSkills', usersSkills)

const addUser = (selectedUser: User) => {
  users.value = users.value.filter((u) => u.id !== selectedUser.id)
  selectedUsers.value.push(selectedUser)
  invitationUsers.value?.push(selectedUser)
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
      () => SkillsService.getAllSkills(token),
    ]

    await makeParallelRequests<User[] | UsersSkills[] | Skill[] | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, users)
        } else if (response.id === 1) {
          checkResponseStatus(response, usersSkills)
        } else if (response.id === 2) {
          checkResponseStatus(response, skills)
        }
      })
    })
  }
})
</script>

<style lang="scss" scoped>
.team-invite-form {
  @include flexible(start, start, column);
}
</style>
