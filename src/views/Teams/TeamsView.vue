<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import TeamsTable from '@Components/Tables/TeamsTable/TeamsTable.vue'

import Team from '@Domain/Team'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'

const teamStore = useTeamStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const teams = ref<Team[]>()

const router = useRouter()

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

function navigateToCreateTeamPage() {
  router.push('/teams/create')
}
</script>

<template>
  <PageLayout content-class-name="teams-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="teams-page__header w-100">
        <Typography class-name="fs-2 text-primary">Список команд</Typography>
        <Button
          variant="primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="navigateToCreateTeamPage"
        >
          Создать команду
        </Button>
      </div>

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
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
