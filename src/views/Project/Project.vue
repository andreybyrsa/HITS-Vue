<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import ProjectPlaceHolder from '@Views/Project/ProjectPlaceHolder.vue'

import ProjectHeader from '@Views/Project/ProjectHeader.vue'
import ProjectContent from '@Views/Project/ProjectContent.vue'

import useUserStore from '@Store/user/userStore'

import { useRoute } from 'vue-router'

import { Project, Sprint, Task } from '@Domain/Project'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'
import useSprintsStore from '@Store/sprints/sprintsStore'
import useTasksStore from '@Store/tasks/tasksStore'
import useTagsStore from '@Store/tags/tagsStore'
import { Tag } from '@Domain/Tag'
import useProjectsStore from '@Store/projects/projectsStore'

const sprintsStore = useSprintsStore()
const tasksStore = useTasksStore()
const tagsStore = useTagsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const project = ref<Project>()
const activeSprint = ref<Sprint>()
const tasks = ref<Task[]>()
const tags = ref<Tag[]>()
const isLoading = ref(false)

const ProjectStore = useProjectsStore()

watchImmediate(
  () => route.params.projectId,
  async () => {
    await getProject()
  },
)

async function getProject() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    if (route.params.projectId) {
      const projectId = route.params.projectId.toString()

      isLoading.value = true

      const projectParallelRequests: RequestConfig[] = [
        {
          request: () => ProjectStore.getProject(projectId, token),
          refValue: project,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => sprintsStore.getActiveSprint(projectId, token),
          refValue: activeSprint,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => tasksStore.getAllTasks(projectId, token),
          refValue: tasks,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => tagsStore.getAllTags(token),
          refValue: tags,
          onErrorFunc: openErrorNotification,
        },
      ]

      await sendParallelRequests(projectParallelRequests)

      isLoading.value = false
    }
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
        class="px-4 py-3 h-100"
        v-if="!isLoading && project"
      >
        <ProjectHeader :project="project" />

        <ProjectContent :project="project" />
      </div>
      <div v-else><ProjectPlaceHolder /></div>
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
