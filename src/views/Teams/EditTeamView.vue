<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Team } from '@Domain'
import { useNotificationsStore } from '@Store'
import { TeamService } from '@Service'
import TeamForm from '@Components/Forms/TeamForm/TeamForm.vue'
import TeamFormPlaceholder from '@Components/Forms/TeamForm/TeamFormPlaceholder.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const notificationsStore = useNotificationsStore()

const route = useRoute()

const team = ref<Team>()

onMounted(async () => {
  const teamId = route.params.id.toString()

  const response = await TeamService.getTeam(teamId)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  team.value = response
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <TeamForm
        v-if="team"
        :team="team"
      />

      <TeamFormPlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>
