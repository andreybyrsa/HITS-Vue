<template>
  <TeamRequestModal
    :is-opened="isOpenedTeamRequestModal"
    mode="read"
    :type="teamRequest?.requestType"
    :team-request="teamRequest"
    @close-modal="closeRequestModal"
    @accept="handleAccept"
    @reject="handleReject"
  />
</template>
<script lang="ts" setup>
import TeamRequestModal from '@Components/Modals/TeamRequestModal/TeamRequestModal.vue'

import TeamService from '@Services/TeamService'

import { TeamAccession } from '@Domain/TeamAccession'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const route = useRoute()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

const isOpenedTeamRequestModal = ref<boolean>(true)

const teamRequest = ref<TeamAccession>()

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const requestId = +route.params.requestId

    const response = await TeamService.getTeamRequest(requestId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    teamRequest.value = response
  }
})

const handleAccept = async () => {
  const currentUser = user.value
  if (teamRequest.value && currentUser?.token) {
    const { token } = currentUser
    const requestId = +route.params.requestId

    const response = await TeamService.acceptRequest(requestId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeRequestModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

const handleReject = async () => {
  const currentUser = user.value
  if (teamRequest.value && currentUser?.token) {
    const { token } = currentUser
    const requestId = +route.params.requestId

    const response = await TeamService.rejectRequest(requestId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeRequestModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

function closeRequestModal() {
  isOpenedTeamRequestModal.value = false
}
</script>
