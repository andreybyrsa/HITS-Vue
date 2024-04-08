<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import { SprintTaskStatsPageProps } from '@Views/Project/SprintTaskStatsPage.types'

import TaskHistoryTable from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.vue'

defineProps<SprintTaskStatsPageProps>()

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

<template>
  <div
    class="d-flex mt-2 w-100 h-100 flex-column gap-3 overflow-scroll sprint-list-page"
  >
    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse:openOnMount="321"
        >
          Описание
        </Button>
        <Collapse id="321">
          <div class="p-2">{{ task.description }}</div>
        </Collapse>
      </li>
    </ul>
    <div class="w-100">
      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Заказчик:' }} </Typography>
        <Typography>
          {{ task.initiator.firstName }} {{ task.initiator.lastName }}
        </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Исполнитель:' }} </Typography>
        <Typography v-if="task.executor">
          {{ task.executor?.firstName }} {{ task.executor?.lastName }}
        </Typography>
        <Typography v-else> {{ 'Отсутствует' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary">
          {{ 'Трудоемкость(Часы):' }}
        </Typography>
        <Typography> {{ task.workHour }} </Typography>
      </div>

      <div class="d-flex flex-column gap-1">
        <Typography class-name="text-primary"> {{ 'Теги:' }} </Typography>
        <div class="d-flex flex-wrap gap-2 w-100 overflow-scroll">
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
      <div>
        <div class="task-history">
          <TaskHistoryTable :task-id="task.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.task-history {
  max-height: 350px !important;
  overflow-y: scroll;
}
</style>
