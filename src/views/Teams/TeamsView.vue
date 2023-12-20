<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import TeamsTable from '@Components/Tables/TeamsTable/TeamsTable.vue'
import Header from '@Components/Header/Header.vue'

import { Team } from '@Domain/Team'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'

const teamStore = useTeamStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const teams = ref<Team[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await teamStore.getTeams(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    teams.value = response
  }
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="teams-page__content p-3 bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <TeamsTable
        v-if="teams"
        v-model="teams"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.teams-page {
  &__content {
    @include flexible(stretch, flex-start, column);
  }
}
</style>
