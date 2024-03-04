<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { User, TeamMember } from '@Domain'
import { TeamService, ManageUsersService } from '@Service'
import { sendParallelRequests, RequestConfig, openErrorNotification } from '@Utils'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import UsersTable from '@Components/Tables/UsersTable/UsersTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const users = ref<User[]>()
const userInTeams = ref<TeamMember[]>([])

onMounted(async () => {
  const ideaMarketParallelRequests: RequestConfig[] = [
    {
      request: () => ManageUsersService.getUsers(),
      refValue: users,
      onErrorFunc: openErrorNotification,
    },
    {
      request: () => TeamService.getAllUsersInTeams(),
      refValue: userInTeams,
      onErrorFunc: openErrorNotification,
    },
  ]

  await sendParallelRequests(ideaMarketParallelRequests)
})
</script>

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

<style lang="scss">
.users-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
