<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import IdeaFormPlaceholder from '@Components/Forms/IdeaForm/IdeaFormPlaceholder.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useNotification from '@Hooks/useNotification'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRoute()

const currentIdea = ref<Idea>()
const isLoading = ref(true)

const {
  isOpenedNotification,
  notificationOptions,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { id } = router.params
    const { token } = currentUser

    const response = await IdeasService.getInitiatorIdea(+id, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    isLoading.value = false
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
      <FormLayout
        v-if="isLoading"
        class-name="w-100 h-100"
      >
        <IdeaFormPlaceholder />
      </FormLayout>

      <IdeaForm
        v-else
        title="Редактирование идеи"
        :idea="currentIdea"
      />

      <NotificationModal
        :type="notificationOptions.type"
        :is-opened="isOpenedNotification"
        @close-modal="handleCloseNotification"
      >
        {{ notificationOptions.message }}
      </NotificationModal>
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
