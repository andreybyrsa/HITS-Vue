<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import IdeaFormPlaceholder from '@Components/Forms/IdeaForm/IdeaFormPlaceholder.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import IdeasService from '@Services/IdeasService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRoute()

const currentIdea = ref<Idea>()
const isLoading = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const id = +router.params.id
    const { token } = currentUser

    const response = await IdeasService.getIdea(id, token)

    if (response instanceof Error) {
      return // notification
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
        v-if="!currentIdea"
        class-name="w-100 h-100"
      >
        <IdeaFormPlaceholder />
      </FormLayout>

      <IdeaForm
        v-else
        title="Редактирование идеи"
        :idea="currentIdea"
      />
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
