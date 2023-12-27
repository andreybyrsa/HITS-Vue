<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="users-groups-view__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <UsersGroupsTable
        v-if="usersGroups"
        v-model="usersGroups"
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
import UsersGroupsTable from '@Components/Tables/UsersGroupsTable/UsersGroupsTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import UsersGroup from '@Domain/UsersGroup'

import UsersGroupsService from '@Services/UsersGroupsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const usersGroups = ref<UsersGroup[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseGroups = await UsersGroupsService.getUsersGroups(token)

    if (responseGroups instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseGroups.message,
      )
    }

    usersGroups.value = responseGroups
  }
})
</script>

<style lang="scss">
.users-groups-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
