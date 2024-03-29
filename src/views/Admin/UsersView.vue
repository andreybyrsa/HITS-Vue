<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="users-view__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <UsersTable
        v-if="users"
        v-model="users"
        :users-in-teams="userInTeams"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import UsersTable from '@Components/Tables/UsersTable/UsersTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { User } from '@Domain/User'

import ManageUsersService from '@Services/ManageUsersService'
import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import { TeamMember } from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<User[]>()
const userInTeams = ref<TeamMember[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const ideaMarketParallelRequests: RequestConfig[] = [
      {
        request: () => ManageUsersService.getUsers(token),
        refValue: users,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => TeamService.getAllUsersInTeams(token),
        refValue: userInTeams,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(ideaMarketParallelRequests)
  }
})
</script>

<style lang="scss">
.users-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
