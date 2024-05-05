<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'

import {
  TaskDataProps,
  TaskCommentsEmits,
} from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

const props = defineProps<TaskDataProps>()
const emit = defineEmits<TaskCommentsEmits>()

const tasksStore = useTasksStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function isEdit(comment: string) {
  if (comment === 'team-leader' && user.value?.role === 'TEAM_LEADER') {
    return false
  } else if (comment === 'initiator' && props.task.executor?.id === user.value?.id) {
    return false
  } else return true
}
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
          @input="(event: HTMLTargetEvent)=>emit('update-leader-comment', event.target.value)"
          :disabled="isEdit('team-leader')"
        />
      </div>

      <div class="h-100 w-100">
        <Textarea
          name="executorComment"
          class-name="task-comments__textarea rounded-end"
          label="Исполнитель"
          placeholder="Комментарий исполнителя"
          :model-value="$props.task.executorComment"
          validate-on-update
          @input="(event: HTMLTargetEvent) => {
            emit('update-executor-comment', event.target.value)
          }"
          :disabled="isEdit('initiator')"
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
