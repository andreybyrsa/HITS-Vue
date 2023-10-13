<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()
const { ideas } = storeToRefs(ideaStore)

const route = useRoute()

const ideasData = ref<Idea[]>([])
const currentIdea = ref<Idea>()

const isLoading = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = route.params

    await ideaStore.fetchIdeas(token)

    ideasData.value = ideas.value

    currentIdea.value = ideasData.value.find((idea) => idea.id == id)

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
  <IdeaModal
    :is-opened="openModal"
    :idea="currentIdea"
    @close-modal="handleCloseIdeaModal"
  />
</template>

<style lang="scss"></style>
