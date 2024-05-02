<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import TaskHistoryTable from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.vue'
import SprintInfoTaskBlock from '@Components/Modals/SprintInfoModal/SprintInfoTaskBlock.vue'

import { develop } from '@Assets/images'

import { Task } from '@Domain/Project'

defineProps<{ task?: Task }>()
</script>

<template>
  <div
    v-if="task"
    class="d-flex gap-3 w-100 overflow-y-scroll"
  >
    <div class="w-75">
      <ul class="list-group rounded-3 w-100">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="task.id"
          >
            Описание
          </Button>
          <Collapse :id="task.id">
            <div class="p-2">{{ task.description }}</div>
          </Collapse>
        </li>
      </ul>

      <TaskHistoryTable :task-id="task.id" />
    </div>

    <div class="w-25"><SprintInfoTaskBlock :task="task" /></div>
  </div>

  <div
    v-else
    class="sprint-info__error h-100 w-100"
  >
    <img
      :src="develop"
      alt="Выберите задачу"
      class="error-view__img"
    />
    <div class="fs-4 text-secondary">
      Выберите задачу, кликнув на одну из списка слева
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sprint-info {
  &__error {
    @include flexible(center, center, column);
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
