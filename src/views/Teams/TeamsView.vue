<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Team } from '@Domain'
import { useNotificationsStore, useTeamStore } from '@Store'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import TeamsTable from '@Components/Tables/TeamsTable/TeamsTable.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const teamStore = useTeamStore()
const notificationsStore = useNotificationsStore()

const teams = ref<Team[]>()

onMounted(async () => {
  const response = await teamStore.getTeams()

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  teams.value = response
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="teams-page__content bg-white"
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
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
