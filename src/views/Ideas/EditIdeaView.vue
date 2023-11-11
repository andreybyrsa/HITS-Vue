<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import IdeaFormPlaceholder from '@Components/Forms/IdeaForm/IdeaFormPlaceholder.vue'

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

  if (currentUser?.token) {
    const id = +router.params.id
    const { token } = currentUser

    const response = await IdeasService.getIdea(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    currentIdea.value = response
  }
})
</script>

<template>
  <PageLayout content-class-name="edit-idea-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <IdeaForm
        v-if="currentIdea"
        title="Редактирование идеи"
        :idea="currentIdea"
      />
      <IdeaFormPlaceholder v-else />
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
