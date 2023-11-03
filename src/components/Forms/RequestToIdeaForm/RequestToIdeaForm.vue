<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { RequestToIdeaProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Button from '@Components/Button/Button.vue'
import RequestTeamCollapse from '@Components/Forms/RequestToIdeaForm/RequestTeamCollapse.vue'
import useUserStore from '@Store/user/userStore'

import RequestTeams from '@Domain/RequestTeams'
import Team from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

defineProps<RequestToIdeaProps>()

const requestTeams = defineModel<RequestTeams[]>('requestTeams', { required: true })
const teams = defineModel<Team[]>('teams', { required: true })

function filterTeamOwner() {
  return teams.value.filter((team) => team.owner.email == user.value?.email)
}

function sendOnPageCreateTeam() {
  router.push('/teams/create')
}
</script>

<template>
  <div
    v-if="user?.email != idea.initiator"
    class="request-form bg-white p-3 rounded-3"
  >
    <div
      v-if="filterTeamOwner().length"
      class="d-flex flex-column w-100 gap-2"
    >
      <RequestTeamCollapse
        v-for="(team, index) in filterTeamOwner()"
        :key="index"
        :team="team"
        v-model:teams="teams"
        v-model:requestTeams="requestTeams"
      />
    </div>

    <div
      v-else
      class="team-request-collapse__button w-100"
    >
      <span class="text-danger">*Вы не являетесь владельцем команды.</span>
      <Button
        class-name="btn-primary"
        @click="sendOnPageCreateTeam"
      >
        Создать команду?
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
  width: 100%;
}
</style>
