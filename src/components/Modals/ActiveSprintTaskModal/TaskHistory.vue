<script lang="ts" setup>
import { TaskHistoryProps } from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'

import TaskHistoryTable from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.vue'

defineProps<TaskHistoryProps>()
</script>

<template>
  <div>
    <div class="w-100 bg-white rounded-top text-primary p-2 border-bottom">
      История перемещений*
    </div>
    <div class="task-history w-100 bg-white rounded-bottom">
      <TaskHistoryTable :task-id="taskId" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-history {
  height: 400px;
  overflow-y: scroll;
}
</style>
