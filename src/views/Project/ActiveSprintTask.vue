<template>
  <div>
    <div
      class="d-flex my-1"
      @click="openTaskModal(task)"
    >
      <div
        :style="{ width: '6px', backgroundColor: getColorBand(task) }"
        class="rounded-start"
      />
      <div
        class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
      >
        <div class="d-flex flex-column border-bottom pb-2">
          <div class="active-sprint__task">
            <Typography>{{ task.name }}</Typography>
          </div>
          <div class="d-flex gap-1 text-secondary">
            {{ getExecutorTask(task.id) }}
          </div>
          <div
            class="d-flex gap-1 text-secondary text-info"
            v-if="task.status === 'OnModification' && task.leaderComment"
          >
            <Typography>
              {{ task.leaderComment }}
            </Typography>
          </div>
          <div
            class="d-flex gap-1 text-secondary text-info"
            v-if="task.status === 'OnVerification' && task.executorComment"
          >
            <Typography>{{ task.executorComment }}</Typography>
          </div>
          <div
            class="d-flex gap-1 text-secondary text-info"
            v-if="
              task.status === 'OnVerification' &&
              user?.id === task.executor?.id &&
              !task.executorComment &&
              user?.role !== 'TEAM_LEADER'
            "
          >
            <Typography>Добавьте комментарий</Typography>
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

    <TaskDescriptionModal
      :is-opened="isOpenedTaskModal"
      :task="(currentTask as Task)"
      :user="(user as User)"
      @close-modal="closeTaskModal"
      @update-leader-comment="changeLeaderComment"
      @update-description="changeDescription"
      @update-name="changeName"
      @update-executor-comment="changeExecutorComment"
    />
  </div>
</template>

<script lang="ts" setup>
import { Task } from '@Domain/Project'
import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

import { ActiveSprintTaskProps } from '@Views/Project/Project.types'
import { ref } from 'vue'
import { User } from '@Domain/User'

import TaskDescriptionModal from '@Components/Modals/SprintModal/TaskDescriptionModal.vue'
import { useDebounceFn } from '@vueuse/core'
import Typography from '@Components/Typography/Typography.vue'

defineProps<ActiveSprintTaskProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const currentTask = ref<Task>()
const isOpenedTaskModal = ref(false)

function getColorBand(task: Task) {
  return task.executor?.id === user.value?.id ? '#0D6EFD' : '#9E9E9E'
}

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

function openTaskModal(task: Task) {
  currentTask.value = task
  isOpenedTaskModal.value = true
}

function closeTaskModal() {
  isOpenedTaskModal.value = false
}

const changeLeaderComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const task = currentTask.value

  if (currentUser?.token && task) {
    const { token } = currentUser
    const { id } = task

    tasksStore.changeLeaderComment(id, input, token)
  }
}, 450)

const changeDescription = useDebounceFn((input: string) => {
  const currentUser = user.value
  const task = currentTask.value

  if (currentUser?.token && task) {
    const { token } = currentUser
    const { id } = task

    tasksStore.changeDescription(id, input, token)
  }
}, 450)

const changeName = useDebounceFn((input: string) => {
  const currentUser = user.value
  const task = currentTask.value

  if (currentUser?.token && task) {
    const { token } = currentUser
    const { id } = task

    tasksStore.changeName(id, input, token)
  }
}, 450)

const changeExecutorComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const task = currentTask.value

  if (currentUser?.token && task) {
    const { token } = currentUser
    const { id } = task

    tasksStore.changeExecutorComment(id, input, token)
  }
}, 450)
</script>
