<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

import FinishProjectOrSprintModal from '@Components/Modals/FinishProjectOrSprintModal/FinishProjectOrSprintModal.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { ProjectProps } from '@Views/Project/Project.types'
import ProjectInfoTabs from '@Views/Project/ProjectInfoTabs'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

import useUserStore from '@Store/user/userStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

import { Project } from '@Domain/Project'

const isOpenedFinishProjectModal = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const sprintStore = useSprintsStore()
const { activeSprint } = storeToRefs(sprintStore)

const props = defineProps<ProjectProps>()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else return 'Реализуется'
}

function navigateToIdea(project: Project) {
  const ideaRoute: RouteRecordRaw = {
    name: 'idea-projects',
    path: 'idea-projects/:projectId/:id',
    alias: '/idea-projects/:projectId/:id',
    component: IdeaModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(
    'project',
    `/idea-projects/${project.id}/${project.ideaId}`,
    ideaRoute,
  )
}

function closeFinishProjectModal() {
  isOpenedFinishProjectModal.value = false
}
function openFinishProjectModal() {
  isOpenedFinishProjectModal.value = true
}

const getContentTab: {
  [key: string]: string
} = {
  initiator: `${props.project.initiator.firstName} ${props.project.initiator.lastName}`,
  customer: `${props.project.customer}`,
  startDate: getFormattedDate(props.project.startDate),
  finishData: getFormattedDate(props.project.finishDate),
}
</script>

<template>
  <div class="w-25">
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      Информация
    </div>

    <div
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-3 border border-top-0"
    >
      <div
        v-for="(tab, index) in ProjectInfoTabs"
        :key="index"
        class="px-2"
      >
        <div class="text-secondary border-bottom pb-1 mb-2">{{ tab.header }}</div>
        <div class="content gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            :class="tab.icon"
          />
          <Typography class-name="text-primary">
            {{ getContentTab[tab.content] }}
          </Typography>
        </div>
      </div>

      <div class="d-flex flex-column gap-2 mt-2">
        <Button
          @click="navigateToIdea(project)"
          variant="primary"
          class-name="w-100"
        >
          Перейти в идею
        </Button>
        <Button
          v-if="
            props.project.status === 'ACTIVE' &&
            (user?.role === 'TEAM_LEADER' ||
              user?.role === 'ADMIN' ||
              user?.role === 'PROJECT_OFFICE') &&
            !activeSprint
          "
          @click="openFinishProjectModal"
          variant="danger"
          class-name="w-100"
        >
          Завершить проект
        </Button>

        <Button
          v-if="props.project.status === 'DONE'"
          @click="openFinishProjectModal"
          variant="primary"
          class-name="w-100"
        >
          Информация о проекте
        </Button>
      </div>
    </div>
  </div>

  <FinishProjectOrSprintModal
    :is-opened="isOpenedFinishProjectModal"
    :project="project"
    @close-modal="closeFinishProjectModal"
  />
</template>

<style lang="scss" scoped>
.content {
  @include flexible(center, start);
}
</style>
