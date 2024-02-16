<script lang="ts" setup>
import { TaskForSprintFormProps } from '@Components/Forms/SprintForm//TaskForSprintForm.types'

defineProps<TaskForSprintFormProps>()

function getFormatedType(type: string) {
  return
}
</script>

<template>
  <div class="task border rounded">
    <p>{{ task.name }}</p>
  </div>
</template>

<style lang="scss" scoped>
.task {
  padding: 3px 12px 3px 3px;
  width: auto;
}
</style>
