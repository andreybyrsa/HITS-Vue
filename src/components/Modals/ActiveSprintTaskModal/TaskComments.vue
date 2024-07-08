<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { TaskDataProps } from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

const props = defineProps<TaskDataProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()

function isAccessLeaderComment() {
  const currentRole = user.value?.role
  return currentRole === 'TEAM_LEADER' ? false : true
}
function isAccessStudentComment() {
  const currentUser = user.value
  const currentExecutor = props.task.executor

  return currentUser?.id === currentExecutor?.id ? false : true
}

const changeLeaderComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const currentTask = props.task

  if (currentUser?.token && currentTask) {
    const { token } = currentUser
    const { id } = currentTask

    tasksStore.changeLeaderComment(id, input, token)
    currentTask.leaderComment = input
  }
}, 450)

const changeExecutorComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const currentTask = props.task

  if (currentUser?.token && currentTask) {
    const { token } = currentUser
    const { id } = currentTask

    tasksStore.changeExecutorComment(id, input, token)
  }
}, 450)
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      Комментарии
    </div>

    <div class="task-comments bg-white rounded-bottom p-3 border border-top-0">
      <div class="h-100 w-100">
        <Textarea
          name="leaderComment"
          class-name="task-comments__textarea rounded-end"
          label="Тим-лидер"
          placeholder="Комментарий тим-лидера"
          :model-value="$props.task.leaderComment"
          validate-on-update
          @input="(event: HTMLTargetEvent)=>changeLeaderComment(event.target.value)"
          :disabled="isAccessLeaderComment()"
        />
      </div>

      <div class="h-100 w-100">
        <Textarea
          name="executorComment"
          class-name="task-comments__textarea rounded-end"
          label="Исполнитель"
          placeholder="Комментарий исполнителя"
          v-model="$props.task.executorComment"
          validate-on-update
          @input="(event: HTMLTargetEvent) => {
            changeExecutorComment(event.target.value)
          }"
          :disabled="isAccessStudentComment()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.task-comments {
  @include flexible(flex-start, flex-start, column, $gap: 12px);
  flex-grow: 1;

  &__textarea {
    resize: none;
  }
}
</style>
