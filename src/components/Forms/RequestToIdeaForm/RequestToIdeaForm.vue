<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { RequestToIdeaFormProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import RequestTeamCollapse from '@Components/Forms/RequestToIdeaForm/RequestTeamCollapse.vue'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore()
const { requests } = storeToRefs(requestsToIdeaStore)

const router = useRouter()

const props = defineProps<RequestToIdeaFormProps>()

function navigateToTeamForm() {
  userStore.setRole('TEAM_OWNER')
  router.push('/teams/create')
}

function getAccessRequestToIdea() {
  const currentUser = user.value

  if (currentUser) {
    const { role } = currentUser
    const { status } = props.ideaMarket

    return role === 'TEAM_OWNER' && status === 'RECRUITMENT_IS_OPEN'
  }
}

function getAccessToCreateTeam() {
  const currentUser = user.value

  if (currentUser) {
    const { role, roles } = currentUser
    const { status } = props.ideaMarket

    return (
      role !== 'TEAM_OWNER' &&
      roles.includes('TEAM_OWNER') &&
      status === 'RECRUITMENT_IS_OPEN'
    )
  }
}
</script>

<template>
  <div
    v-if="getAccessRequestToIdea()"
    class="d-flex w-100 bg-white rounded-3"
  >
    <div class="w-100 d-flex flex-column">
      <Typography class-name="fs-6 py-2 px-3 border-bottom">
        Ваши команды
      </Typography>
      <div class="d-flex flex-column gap-2 p-3">
        <RequestTeamCollapse
          v-for="(team, index) in ownerTeams"
          :key="index"
          :team="team"
          :idea="ideaMarket"
          v-model:requestTeams="requests"
          :isDisabledButtonSkills="false"
        />
      </div>
    </div>
  </div>

  <div
    v-if="getAccessToCreateTeam()"
    class="d-flex w-100 px-3 align-items-center justify-content-between"
  >
    <template>
      <Typography class-name="text-danger">
        *Вы не являетесь владельцем команды.
      </Typography>
      <Button
        variant="primary"
        @click="navigateToTeamForm"
      >
        Создать команду?
      </Button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start);
  width: 100%;
}
</style>
