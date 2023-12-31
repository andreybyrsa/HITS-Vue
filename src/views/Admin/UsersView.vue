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
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import UsersTable from '@Components/Tables/UsersTable/UsersTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { User } from '@Domain/User'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const users = ref<User[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    users.value = response
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
