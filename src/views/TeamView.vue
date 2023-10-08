<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'

import Team from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import TeamService from '@Services/TeamService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const currentTeam = ref<Team>()

const isLoading = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = route.params

    const response = await TeamService.getTeam(id, token)

    if (response instanceof Error) {
      return
    }

    currentTeam.value = response
    isLoading.value = false
  }
})

const openModal = ref(false)

watchImmediate(
  () => route.params.id,
  (id) => {
    if (id) {
      setTimeout(() => {
        openModal.value = true
      }, 10)
    }
  },
)

function handleCloseIdeaModal() {
  openModal.value = false
}
</script>

<template>
  <TeamModal
    :is-opened="openModal"
    :idea="currentTeam"
    @close-modal="handleCloseIdeaModal"
  />
</template>

<style lang="scss"></style>
