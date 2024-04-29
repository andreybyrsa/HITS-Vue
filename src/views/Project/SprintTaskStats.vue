<template>
  <div>
    <div class="d-flex my-1">
      <div class="bg-white p-2 w-100 rounded-end rounded-start">
        <div class="d-flex flex-column border-bottom pb-2">
          <div class="active-sprint__task">
            <Typography>{{ task.name }}</Typography>
          </div>
          <div class="d-flex gap-1 text-secondary">
            {{ getExecutorTask(task.id) }}
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 w-100 mt-2">
          <div
            v-for="(tag, index) in task.tags"
            :key="index"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
            class="px-2 py-1 rounded-2 text-center align-self-start"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { SprintTaskStatsProps } from '@Views/Project/SprintTaskStats.types'

import useTasksStore from '@Store/tasks/tasksStore'
import Typography from '@Components/Typography/Typography.vue'

defineProps<SprintTaskStatsProps>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

function getExecutorTask(taskId: string) {
  const currentTask = tasks.value.find(({ id }) => id === taskId)
  if (currentTask?.executor)
    return `${currentTask.executor.firstName} ${currentTask.executor.lastName}`
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}
</script>
