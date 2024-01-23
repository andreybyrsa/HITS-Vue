<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import ProjectHeader from '@Views/Project/ProjectHeader.vue'
import ProjectContent from '@Views/Project/ProjectContent.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import ProjectService from '@Services/ProjectService'

import { useRoute } from 'vue-router'

import { Project } from '@Domain/Project'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const project = ref<Project>()
const isLoading = ref(false)

watchImmediate(
  () => route.params.id,
  async () => {
    return await getProject()
  },
)

onMounted(getProject)

async function getProject() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    const projectId = route.params.id.toString()

    isLoading.value = true
    const response = await ProjectService.getProject(projectId, token)

    if (response instanceof Error) {
      return useNotificationsStore().createSystemNotification(
        'Система',
        response.message,
      )
    }

    project.value = response
    isLoading.value = false
  }
}
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="project-page__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <div
        class="p-4"
        v-if="!isLoading && project"
      >
        <ProjectHeader :project="project" />

        <ProjectContent :project="project" />
      </div>
      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.project-page {
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
