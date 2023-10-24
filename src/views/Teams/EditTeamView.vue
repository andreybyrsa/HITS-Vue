<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import TeamForm from '@Components/Forms/TeamForm/TeamForm.vue'
import TeamFormPlaceholder from '@Components/Forms/TeamForm/TeamFormPlaceholder.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Team from '@Domain/Team'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const team = ref<Team>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = route.params

    const response = await TeamService.getTeam(id, token)

    if (response instanceof Error) {
      return
    }

    team.value = response
  }
})
</script>

<template>
  <PageLayout content-class-name="bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <TeamForm
        v-if="team"
        :team="team"
      />

      <TeamFormPlaceholder v-else />
    </template>
  </PageLayout>
</template>
