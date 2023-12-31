<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import IdeaFormPlaceholder from '@Components/Forms/IdeaForm/IdeaFormPlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const router = useRoute()

const currentIdea = ref<Idea>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role) {
    const id = router.params.id.toString()
    const { token, role } = currentUser
    const currentIdeaServiceKey =
      role === 'INITIATOR' ? 'getInitiatorIdea' : 'getIdea'

    const response = await IdeasService[currentIdeaServiceKey](id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    currentIdea.value = response
  }
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="edit-idea-page__content"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <IdeaForm
        v-if="currentIdea"
        title="Редактирование идеи"
        :idea="currentIdea"
      />
      <IdeaFormPlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.edit-idea-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
