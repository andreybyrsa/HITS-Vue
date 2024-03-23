<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Icon from '@Components/Icon/Icon.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'

import { TaskProps } from '@Views/Project/Project.types'

import { Task, TaskStatus } from '@Domain/Project'

import useTasksStore from '@Store/tasks/tasksStore'

const props = defineProps<TaskProps>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const isOpenedUpdateNewTask = ref(false)
const updatingTask = ref<Task>()

function getClassBgColor(status: TaskStatus) {
  if (status === 'InBackLog') return 'bg-primary'
  if (status === 'Done') return 'bg-secondary'
  return 'bg-warning'
}

function getTooltipByBlock(status: TaskStatus) {
  if (status === 'InBackLog') return 'Приоритетность задачи'
  if (status === 'Done') return 'Задача завершена'
  return 'Задача в активном спринте'
}

function getStyleByProps() {
  if (!props.small) return { width: 'max-content' }
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function checkTaskInSprint(sprintId?: string) {
  return !sprintId
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

function openUpdateNewTask(task: Task) {
  if (!props.small) {
    updatingTask.value = task
    isOpenedUpdateNewTask.value = true
  }
}

function closeUpdateNewTask() {
  isOpenedUpdateNewTask.value = false
}
</script>

<template>
  <div class="bg-white overflow-hidden rounded border mb-2">
    <div class="task">
      <div class="d-flex gap-2 task__left">
        <div
          class="task__left-block text-white fs-5"
          :class="getClassBgColor(task.status)"
          v-tooltip="getTooltipByBlock(task.status)"
        >
          {{ !task.sprintId ? task.position : undefined }}
        </div>
        <div
          class="task__left-name"
          :style="getStyleByProps()"
          :data-active="checkTaskInSprint(task.sprintId) && !small"
          @click="openUpdateNewTask(task)"
        >
          <div>{{ task.name }}</div>
        </div>
      </div>

      <div
        class="d-flex"
        v-if="small"
      >
        <Icon
          v-for="tag in task.tag"
          :key="tag.id"
          :style="{
            backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
            color: tag.color,
          }"
          class-name="bi bi-circle-fill p-1 rounded-2"
          v-tooltip="tag.name"
        />
      </div>

      <div
        v-else
        class="task__left-icon w-100 cursor-pointer"
        v-collapse="task.id"
      >
        <Icon
          v-for="tag in task.tag"
          :key="tag.id"
          :style="{
            backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
            color: tag.color,
          }"
          class-name="bi bi-circle-fill p-1 rounded-2"
          v-tooltip="tag.name"
        />

        <Icon class-name="bi bi-chevron-down fs-5 me-2" />
      </div>
    </div>

    <Collapse :id="task.id">
      <div class="d-flex border-top text-secondary">
        <div class="w-75 p-2 border-end">
          {{ task.description }}
        </div>
        <div class="w-25 p-2">
          <div>
            Постановщик: {{ task.initiator.firstName }} {{ task.initiator.lastName }}
          </div>
          <div>Дата создания: {{ getFormattedDate(task.startDate) }}</div>
          <div>Трудоемкость: {{ task.workHour }}ч</div>
        </div>
      </div>
    </Collapse>

    <TaskModal
      :is-opened="isOpenedUpdateNewTask"
      v-model="tasks"
      :task="updatingTask"
      @close-modal="closeUpdateNewTask"
    />
  </div>
</template>

<style scoped lang="scss">
.task {
  @include flexible(center, space-between);

  &__left {
    @include flexible(center, center);

    &-block {
      min-width: 36px;
      height: 40px;
      @include flexible(center, center);
    }

    &-name {
      @include textEllipsis(1);
      transition: $default-transition-settings;

      &[data-active='true']:hover {
        cursor: pointer;
        color: $primary-color;
      }
    }

    &-icon {
      height: 40px;
      @include flexible(center, flex-end, $gap: 6px);
    }
  }
}
</style>
