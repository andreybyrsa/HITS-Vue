<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import { SprintTaskStatsPageProps } from '@Views/Project/SprintTaskStatsPage.types'
import Table from '@Components/Table/Table.vue'

import { useDateFormat } from '@vueuse/core'

import { TableColumn } from '@Components/Table/Table.types'

import { TaskMovementLog, TaskStatus } from '@Domain/Project'

const props = defineProps<SprintTaskStatsPageProps>()

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}

const taskHistoryTableColumns: TableColumn<TaskMovementLog>[] = [
  {
    key: 'status',
    label: 'Статус',
    size: 'col-4',
    getRowCellStyle: getTaskHistoryStatusStyle,
  },
  {
    key: 'startDate',
    label: 'Дата вступления',
    size: 'col-4',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'endDate',
    label: 'Дата окончания',
    size: 'col-4',
    getRowCellFormat: getFormattedDate,
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY HH:mm')
    return formattedDate.value
  }
}

function getTaskHistoryStatusStyle(status: TaskStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'OnModification') {
    initialClass.push('bg-blueviolet-subtle', 'text-blueviolet')
    return initialClass
  }

  if (status === 'NewTask') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'InProgress') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'OnVerification') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }
  if (status === 'Done' || status === 'InBackLog') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}
</script>

<template>
  <div
    class="d-flex mt-2 w-100 h-100 flex-column gap-3 overflow-y-scroll sprint-task-stats-page"
  >
    <div class="fs-4 w-100 text-primary">{{ props.task.name }}</div>
    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse:openOnMount="321"
        >
          Описание
        </Button>
        <Collapse id="321">
          <div class="p-2">{{ props.task.description }}</div>
        </Collapse>
      </li>
    </ul>
    <div class="w-100">
      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Заказчик:' }} </Typography>
        <Typography>
          {{ props.task.initiator.firstName }} {{ props.task.initiator.lastName }}
        </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Исполнитель:' }} </Typography>
        <Typography v-if="task.executor">
          {{ props.task.executor?.firstName }} {{ props.task.executor?.lastName }}
        </Typography>
        <Typography v-else> {{ 'Отсутствует' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary">
          {{ 'Трудоемкость(Часы):' }}
        </Typography>
        <Typography> {{ props.task.workHour }} </Typography>
      </div>

      <div class="d-flex flex-column gap-1">
        <Typography class-name="text-primary"> {{ 'Теги:' }} </Typography>
        <div class="d-flex flex-wrap gap-2 w-100 overflow-scroll">
          <div
            v-for="(tag, index) in props.task.tags"
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
          <Table
            class-name="pe-3"
            :columns="taskHistoryTableColumns"
            :data="logs"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sprint-task-stats-page {
  height: 90%;
  max-height: 90%;
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.task-history {
  max-height: 350px !important;
}
</style>
