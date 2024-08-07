<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import { ProjectProps } from '@Views/Project/Project.types'

import AboutProjectPage from '@Views/Project/AboutProjectPage.vue'
import SprintsListPage from '@Views/Project/SprintsListPage.vue'
import ActiveSprint from '@Views/Project/ActiveSprint.vue'

import useSprintsStore from '@Store/sprints/sprintsStore'
import useUserStore from '@Store/user/userStore'
import BacklogPage from './BacklogPage.vue'
import RolesTypes from '@Domain/Roles'

const sprintsStore = useSprintsStore()
const { activeSprint } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<ProjectProps>()

const isTabAboutProject = ref(false)
const isTabBacklog = ref(false)
const isTabSprints = ref(false)
const isTabActiveSprint = ref(false)

function moveThroughTabs(role?: RolesTypes) {
  if (role === 'ADMIN' || role === 'PROJECT_OFFICE' || role === 'INITIATOR') {
    switchToTabAboutProject()
  } else if (activeSprint?.value) {
    switchToTabSprint()
  } else switchToTabBacklog()
}

watchImmediate(
  () => user.value?.role,
  (role) => {
    moveThroughTabs(role)
  },
)

watchImmediate(
  () => activeSprint?.value,
  () => {
    moveThroughTabs(user.value?.role)
  },
)

function switchToTabAboutProject() {
  isTabAboutProject.value = true
  isTabBacklog.value = false
  isTabSprints.value = false
  isTabActiveSprint.value = false
}
function switchToTabBacklog() {
  isTabAboutProject.value = false
  isTabBacklog.value = true
  isTabSprints.value = false
  isTabActiveSprint.value = false
}
function switchToTabSprints() {
  isTabAboutProject.value = false
  isTabBacklog.value = false
  isTabSprints.value = true
  isTabActiveSprint.value = false
}
function switchToTabSprint() {
  isTabAboutProject.value = false
  isTabBacklog.value = false
  isTabSprints.value = false
  isTabActiveSprint.value = true
}

function getNavLinkStyle(isCurrentTab: boolean) {
  return [
    'nav-link',
    'fw-normal',
    'pb-1',
    'cursor-pointer',
    { 'active text-primary': isCurrentTab },
    { 'text-secondary': !isCurrentTab },
  ]
}
</script>

<template>
  <div class="content">
    <div class="px-3">
      <ul class="nav nav-tabs">
        <div
          :class="getNavLinkStyle(isTabAboutProject)"
          @click="switchToTabAboutProject"
        >
          О проекте
        </div>
        <div
          :class="getNavLinkStyle(isTabBacklog)"
          @click="switchToTabBacklog"
        >
          Бэклог
        </div>
        <div
          :class="getNavLinkStyle(isTabSprints)"
          @click="switchToTabSprints"
        >
          Спринты
        </div>
        <div
          v-if="activeSprint"
          :class="getNavLinkStyle(isTabActiveSprint)"
          @click="switchToTabSprint"
        >
          Активный спринт
        </div>
      </ul>
    </div>

    <AboutProjectPage
      v-if="isTabAboutProject"
      :project="project"
    />

    <BacklogPage
      v-if="isTabBacklog"
      :tasks="tasks"
    />

    <SprintsListPage
      v-if="isTabSprints"
      :project="project"
    />

    <ActiveSprint
      v-if="isTabActiveSprint"
      :project="project"
    />
  </div>
</template>
