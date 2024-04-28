<script lang="ts" setup>
import {
  TaskStatisticsModalProps,
  TaskStatisticsModalEmits,
} from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TaskHeader from '@Components/Modals/ActiveSprintTaskModal/TaskHeader.vue'
import TaskData from '@Components/Modals/ActiveSprintTaskModal/TaskData.vue'
import TaskHistory from '@Components/Modals/ActiveSprintTaskModal/TaskHistory.vue'
import TaskInfo from '@Components/Modals/ActiveSprintTaskModal/TaskInfo.vue'
import TaskComments from '@Components/Modals/ActiveSprintTaskModal/TaskComments.vue'

defineProps<TaskStatisticsModalProps>()
const emit = defineEmits<TaskStatisticsModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="task-statistic-modal p-3">
      <div class="task-statistic-modal__left-side w-75">
        <TaskHeader @close-modal="emit('close-modal')" />

        <TaskData :task="task" />

        <TaskHistory :task-id="task.id" />
      </div>
      <div class="task-statistic-modal__right-side w-25">
        <TaskInfo :task="task" />

        <TaskComments />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.task-statistic-modal {
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  overflow-y: scroll;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: 100%;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .task-statistic-modal,
.modal-layout-leave-to .task-statistic-modal {
  transform: translateX(100%);
}
</style>
