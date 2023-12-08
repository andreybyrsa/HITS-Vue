<script lang="ts" setup>
import { Ref, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { RequestToIdeaFormProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import RequestTeamCollapse from '@Components/Forms/RequestToIdeaForm/RequestTeamCollapse.vue'

import { Team } from '@Domain/Team'
import RequestTeamToIdea from '@Domain/RequestTeamToIdea'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore()
const { requests } = storeToRefs(requestsToIdeaStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()

const props = defineProps<RequestToIdeaFormProps>()

const ownerTeams = ref<Team[]>()

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.idea

    const parallelRequests = [
      () => TeamService.getOwnerTeams(token),
      () => requestsToIdeaStore.getRequestsToIdea(id, token),
    ]

    await makeParallelRequests<Team[] | RequestTeamToIdea[] | Error>(
      parallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, ownerTeams)
        }
      })
    })
  }
})

function navigateToTeamForm() {
  router.push('/teams/create')
}

function getAccessRequestToIdea() {
  return (
    user.value?.id !== props.idea.initiator.id && user.value?.role === 'TEAM_OWNER'
  )
}
</script>

<template>
  <div
    v-if="getAccessRequestToIdea() && ownerTeams"
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
          :idea="idea"
          v-model:requestTeams="requests"
          :isDisabledButtonSkills="false"
        />
      </div>
    </div>
  </div>

  <div
    v-else
    class="d-flex w-100 px-3 align-items-center justify-content-between"
  >
    <Typography class-name="text-danger">
      *Вы не являетесь владельцем команды.
    </Typography>
    <Button
      v-if="user?.role === 'TEAM_OWNER'"
      variant="primary"
      @click="navigateToTeamForm"
    >
      Создать команду?
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start);
  width: 100%;
}
</style>
