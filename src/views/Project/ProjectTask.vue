<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'

import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import Icon from '@Components/Icon/Icon.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'
import Button from '@Components/Button/Button.vue'

import { TaskProps } from '@Views/Project/Project.types'

import { Task, TaskStatus } from '@Domain/Project'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import useTasksStore from '@Store/tasks/tasksStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()

const props = defineProps<TaskProps>()

const isOpenedDeleteModal = ref(false)

const isOpenedUpdateNewTask = ref(false)
const updatingTask = ref<Task>()

async function deleteTask() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const taskId = props.task.id

    await tasksStore.deleteTask(taskId, token)
  }
}

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
  if (
    !props.small &&
    user.value?.role !== 'TEACHER' &&
    user.value?.role !== 'PROJECT_OFFICE' &&
    !task.sprintId
  ) {
    updatingTask.value = task
    isOpenedUpdateNewTask.value = true
  }
}

function closeUpdateNewTask() {
  isOpenedUpdateNewTask.value = false
}

function openDeleteModal() {
  isOpenedDeleteModal.value = true
}

function closeDeleteModal() {
  isOpenedDeleteModal.value = false
}
</script>

<template>
  <div class="d-flex gap-2 mb-2 w-100">
    <div
      :class="small && 'cursor-pointer'"
      class="bg-white overflow-hidden rounded border w-100"
    >
      <div class="task">
        <div class="d-flex gap-2 task__left">
          <div
            class="task__left-block text-white fs-5"
            :class="getClassBgColor(task.status)"
            v-tooltip="getTooltipByBlock(task.status)"
          >
            {{ task.sprintId ? undefined : task.position }}
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
          v-if="small"
          class="d-flex gap-1 me-2"
        >
          <Icon
            v-for="tag in task.tags"
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
          class="task__left-icon w-100 cursor-pointer me-2"
          v-collapse="task.id"
        >
          <Icon
            v-for="tag in task.tags"
            :key="tag.id"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
            class-name="bi bi-circle-fill p-1 rounded-2"
            v-tooltip="tag.name"
          />

          <Icon class-name="bi bi-chevron-down fs-5" />
        </div>
      </div>

      <Collapse :id="task.id">
        <div class="d-flex border-top text-secondary">
          <div class="w-75 p-2 border-end">
            {{ task.description }}
          </div>
          <div class="w-25 p-2">
            <div>
              Постановщик: {{ task.initiator.firstName }}
              {{ task.initiator.lastName }}
            </div>
            <div>Дата создания: {{ getFormattedDate(task.startDate) }}</div>
            <div>Трудоемкость: {{ task.workHour }}ч</div>
          </div>
        </div>
      </Collapse>

      <TaskModal
        :is-opened="isOpenedUpdateNewTask"
        :task="updatingTask"
        @close-modal="closeUpdateNewTask"
      />
    </div>

    <Button
      v-if="user?.role === 'TEAM_LEADER' && !small"
      variant="outline-danger"
      class-name="task__button bi bi-x"
      @click="openDeleteModal"
    />
    <ConfirmModal
      :is-opened="isOpenedDeleteModal"
      textQuestion="Вы действительно хотите удалить эту задачу?"
      text-button="Удалить"
      @close-modal="closeDeleteModal"
      @action="deleteTask"
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
