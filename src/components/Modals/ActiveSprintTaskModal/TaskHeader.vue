<script lang="ts" setup>
import { TaskStatisticsModalEmits } from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

const emit = defineEmits<TaskStatisticsModalEmits>()
</script>

<template>
  <div class="task-header">
    <Button
      variant="primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('close-modal')"
    >
      Назад
    </Button>

    <Typography class-name="p-2 w-100 bg-white rounded fs-4 text-primary">
      Информация о задаче
    </Typography>
  </div>
</template>

<style lang="scss" scoped>
.task-header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
</style>
