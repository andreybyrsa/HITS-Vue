<script lang="ts" setup>
import { ref, watch } from 'vue'

import { SprintInfoContentProps } from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'

import SprintInfoTask from '@Components/Modals/SprintInfoModal/SprintInfoTask.vue'
import SprintInfo from '@Components/Modals/SprintInfoModal/SprintInfo.vue'

const props = defineProps<SprintInfoContentProps>()

const isTabSprint = ref(true)
const isTabTask = ref(false)

watch(
  () => props.task,
  (currentTask) => {
    currentTask ? switchToTabTask() : switchToTabSprint()
  },
)

function switchToTabSprint() {
  isTabSprint.value = true
  isTabTask.value = false
}

function switchToTabTask() {
  isTabSprint.value = false
  isTabTask.value = true
}

function getNavLinkStyle(isCurrentTable: boolean) {
  return [
    'nav-link',
    'text-size',
    'cursor-pointer',
    { 'border-bottom border-primary text-primary': isCurrentTable },
    { 'text-secondary': !isCurrentTable },
  ]
}
</script>

<template>
  <div class="d-flex flex-column w-100 h-100 overflow-y-scroll">
    <div class="d-flex nav-underline border-bottom">
      <div
        :class="getNavLinkStyle(isTabSprint)"
        @click="switchToTabSprint"
      >
        Общая статистика
      </div>
      <div
        :class="getNavLinkStyle(isTabTask)"
        @click="switchToTabTask"
      >
        Статистика задачи
      </div>
    </div>

    <div class="mt-3 w-100 h-100">
      <SprintInfoTask
        v-if="isTabTask"
        :task="task"
      />

      <SprintInfo
        v-if="isTabSprint"
        :sprint="sprint"
        :sprint-marks="sprintMarks"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-size {
  font-size: 19px;
}
</style>
