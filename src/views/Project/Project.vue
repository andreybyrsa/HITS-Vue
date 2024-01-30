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
import ProjectService from '@Services/ProjectService'

import { useRoute } from 'vue-router'

import { Project, Sprint, Task } from '@Domain/Project'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'
import useSprintsStore from '@Store/sprints/sprintsStore'
import useTasksStore from '@Store/tasks/tasksStore'
import useProjectsStore from '@Store/projects/projectsStore'

const sprintsStore = useSprintsStore()
const tasksStore = useTasksStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const project = ref<Project>()
const sprints = ref<Sprint[]>()
const activeSprint = ref<Sprint>()
const tasks = ref<Task[]>()
const isLoading = ref(false)

const ProjectStore = useProjectsStore()

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

    const ideasMarketParallelRequests: RequestConfig[] = [
      {
        request: () => ProjectStore.getProject(projectId, token),
        refValue: project,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintsStore.getAllSprints(projectId, token),
        refValue: sprints,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => tasksStore.getAllTasks(projectId, token),
        refValue: tasks,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintsStore.getActiveSprint(projectId, token),
        refValue: activeSprint,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(ideasMarketParallelRequests)

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
        class="p-4 h-100"
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
