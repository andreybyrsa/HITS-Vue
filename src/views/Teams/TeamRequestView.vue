<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import useUserStore from '@Store/user/userStore'
import TeamService from '@Services/TeamService'
import TeamRequestModal from '@Components/Modals/TeamRequestModal/TeamRequestModal.vue'
import { TeamRequest } from '@Domain/TeamRequest'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const currentTeamRequest = ref<TeamRequest>()

const isLoading = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { requestId } = route.params

    const response = await TeamService.getTeamRequest(requestId, token)

    if (response instanceof Error) {
      return
    }

    currentTeamRequest.value = response

    isLoading.value = false
  }
})

const openModal = ref(false)

watchImmediate(
  () => route.params.requestId,
  (id) => {
    if (id) {
      setTimeout(() => {
        openModal.value = true
      }, 10)
    }
  },
)

const handleResponse = async (request: TeamRequest) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.responseToRequest(request, token)

    if (response instanceof Error) {
      return //уведомление
    }
    //уведомеление
  }
}

function handleCloseTeamModal() {
  openModal.value = false
}
</script>

<template>
  <TeamRequestModal
    mode="read"
    :request="currentTeamRequest"
    :type="currentTeamRequest?.type"
    :is-opened="openModal"
    @close-modal="handleCloseTeamModal"
    @response="handleResponse"
  />
</template>

<style lang="scss"></style>
