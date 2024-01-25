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

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<ProjectProps>()

const isTabAboutProject = ref(false)
const isTabBacklog = ref(false)
const isTabSprints = ref(false)
const isTabActiveSprint = ref(false)

watchImmediate(
  () => user.value?.role,
  (role) => {
    if (role === 'ADMIN' || role === 'PROJECT_OFFICE' || role === 'INITIATOR') {
      return switchToTabAboutProject()
    } else if (sprints.value.find(({ status }) => status === 'ACTIVE')) {
      return switchToTabSprint()
    } else return switchToTabSprints()
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
  <div class="border-bottom px-3">
    <ul class="nav nav-underline">
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
        :class="getNavLinkStyle(isTabActiveSprint)"
        @click="switchToTabSprint"
      >
        Активный спринт
      </div>
    </ul>
  </div>

  <div
    v-if="isTabAboutProject"
    class="mt-4"
  >
    <AboutProjectPage :project="project" />
  </div>
  <div
    v-if="isTabBacklog"
    class="content-dev"
  >
    Бэклог
  </div>
  <div
    v-if="isTabSprints"
    class="content-dev"
  >
    <SprintsListPage :sprints="sprint" />
  </div>
  <div
    v-if="isTabActiveSprint"
    class="content-dev"
  >
    <ActiveSprint />
  </div>
</template>

<style lang="scss">
.content-dev {
  width: 100%;
  height: 60vh;

  @include flexible(start, center);
}
</style>
