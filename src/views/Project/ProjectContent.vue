<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import ProjectProps from '@Views/Project/Project.types'

import AboutProjectPage from '@Views/Project/AboutProjectPage.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const currentRole = user.value?.role

const isTabAboutProject = ref(
  currentRole === 'ADMIN' ||
    currentRole === 'PROJECT_OFFICE' ||
    currentRole === 'INITIATOR',
)
const isTabBacklog = ref(false)
const isTabSprints = ref(currentRole === 'MEMBER' || currentRole === 'TEAM_OWNER')
const isTabActiveSprint = ref(false)

defineProps<ProjectProps>()

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

  <div>
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
      Спринты
    </div>
    <div
      v-if="isTabActiveSprint"
      class="content-dev"
    >
      Активный спринт
    </div>
  </div>
</template>

<style lang="scss">
.content-dev {
  width: 100%;
  height: 60vh;

  @include flexible(center, center);
}
</style>
