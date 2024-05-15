<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { reactiveComputed, useDateFormat } from '@vueuse/core'

import { ColumnTask, ActiveSprintProps } from '@Views/Project/Project.types'

import FinishProjectOrSprintModal from '@Components/Modals/FinishProjectOrSprintModal/FinishProjectOrSprintModal.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'
import ActiveSprintTask from '@Views/Project/ActiveSprintTask.vue'
import BurndownModal from '@Components/Modals/BurndownModal/BurndownModal.vue'
import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

import { Task, TaskStatus } from '@Domain/Project'

import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

defineProps<ActiveSprintProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const taskStore = useTasksStore()

const sprintStore = useSprintsStore()
const { activeSprint } = storeToRefs(sprintStore)

const isLoadingTaskData = ref(false)
const isOpenedCreateNewTask = ref(false)
const isOpenedFinishSprintModal = ref(false)
const isOpenedBurndownModal = ref(false)

const unfinishedTasks = computed<Task[]>(
  () => activeSprint?.value?.tasks.filter(({ status }) => status !== 'Done') ?? [],
)

function getTasksByStatus(currentStatus: TaskStatus) {
  return activeSprint?.value?.tasks
    .filter(({ status }) => status === currentStatus)
    .sort((a: Task) => (a.executor?.id === user.value?.id ? -1 : 1))
}

const onModificationTask = reactiveComputed<ColumnTask>(() => {
  return {
    name: 'OnModification',
    tasks: getTasksByStatus('OnModification'),
  }
})
const newTask = reactiveComputed<ColumnTask>(() => {
  return {
    name: 'NewTask',
    tasks: getTasksByStatus('NewTask'),
  }
})
const inProgressTask = reactiveComputed<ColumnTask>(() => {
  return {
    name: 'InProgress',
    tasks: getTasksByStatus('InProgress'),
  }
})
const onVerificationTask = reactiveComputed<ColumnTask>(() => {
  return {
    name: 'OnVerification',
    tasks: getTasksByStatus('OnVerification'),
  }
})
const doneTask = reactiveComputed<ColumnTask>(() => {
  return {
    name: 'Done',
    tasks: getTasksByStatus('Done'),
  }
})

const columnsTasksArray = computed<ColumnTask[]>(() => {
  return [onModificationTask, newTask, inProgressTask, onVerificationTask, doneTask]
})

const checkMyInProgressTask = computed(() =>
  Boolean(
    inProgressTask.tasks?.find(({ executor }) => executor?.id === user.value?.id),
  ),
)

async function taskParallelRequests(
  taskId: string,
  currentArrayTask: ColumnTask,
  token: string,
) {
  const status = currentArrayTask.name

  const inTaskParallelRequests: RequestConfig[] = [
    {
      request: () =>
        taskStore.changeExecutorTask(
          taskId,
          status === 'InProgress' ? user.value : null,
          token,
        ),
      refValue: ref(),
      onErrorFunc: openErrorNotification,
      statement: status === 'NewTask' || status === 'InProgress',
    },
    {
      request: () => taskStore.createTaskLog(taskId, user.value, status, token),
      refValue: ref(),
      onErrorFunc: openErrorNotification,
    },
  ]
  await sendParallelRequests(inTaskParallelRequests)
}

async function moveTask(evt: any) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    if (evt.added) {
      const task: Task = evt.added.element
      const { id: taskId } = task
      const currentArrayTask = columnsTasksArray.value.find((arrayTasks) =>
        arrayTasks.tasks?.includes(task),
      )

      if (currentArrayTask)
        await taskParallelRequests(taskId, currentArrayTask, token)

      isLoadingTaskData.value = false
    }
  }
}

function checkUserTask(evt: any) {
  return (
    evt.draggedContext.element.executor.id === user.value?.id && accessDragTask(evt)
  )
}

function accessDragTask(evt: any) {
  const draggedStatus: TaskStatus = evt.draggedContext.element.status
  const relatedStatus: TaskStatus = evt.relatedContext.element
    ? evt.relatedContext.element.status
    : evt.related.className.split(' ').pop()

  const accessStatus: { [key in TaskStatus]: TaskStatus[] } = {
    NewTask: ['InProgress', 'NewTask'],
    InProgress: ['InProgress', 'OnVerification'],
    OnVerification: ['OnVerification', 'OnModification', 'Done'],
    OnModification: ['InProgress', 'OnModification'],
    Done: ['NewTask', 'InProgress', 'OnVerification', 'OnModification', 'Done'],
    InBackLog: [],
  }

  return accessStatus[draggedStatus].includes(relatedStatus)
}

function checkOnModificationTask(evt: any) {
  const isCheckMyTask =
    evt.draggedContext.element.executor.id === user.value?.id && accessDragTask(evt)
  const inProgressTask = activeSprint?.value?.tasks.find(
    ({ status, executor }) =>
      status === 'InProgress' && executor?.id === user.value?.id,
  )

  return inProgressTask ? false : isCheckMyTask
}

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}

const columns = computed(() => [
  {
    name: 'На доработке',
    tooltip:
      'Здесь находятся задачи, которые были отправлены на доработку для исправления ошибок или улучшения качества. Эти задачи нужно выполнить в первую очередь, чтобы не затягивать сроки проекта.',
    class: 'OnModification',
    color: '#8A2BE2',
    list: onModificationTask.tasks,
    move: checkOnModificationTask,
    handle: undefined,
    disabled: isLoadingTaskData.value,
  },
  {
    name: 'Новые',
    tooltip:
      'Здесь находятся задачи, которые еще не были назначены команде или отдельному разработчику. Эти задачи можно выбирать по своему усмотрению, учитывая приоритеты и сложность.',
    class: 'NewTask',
    color: '#0d6efd',
    list: newTask.tasks,
    move: accessDragTask,
    handle: checkMyInProgressTask.value,
    disabled: isLoadingTaskData.value,
  },
  {
    name: 'На выполнении',
    tooltip:
      'Здесь находятся задачи, которые в данный момент выполняются командой или отдельным разработчиком. Данные задачи нужно довести до конца и не переключаться на другие.',
    class: 'InProgress',
    color: '#f5ec0a',
    list: inProgressTask.tasks,
    move: checkUserTask,
    handle: undefined,
    disabled: isLoadingTaskData.value,
  },
  {
    name: 'На проверке',
    tooltip:
      'Здесь находятся задачи, которые были выполнены и отправлены тимлиду на проверку качества, функциональности и соответствия требованиям.',
    class: 'OnVerification',
    color: '#ffa800',
    list: onVerificationTask.tasks,
    move: accessDragTask,
    handle: user.value?.role !== 'TEAM_LEADER',
    disabled: isLoadingTaskData.value,
  },
  {
    name: 'Выполненные',
    tooltip:
      'Здесь находятся задачи, которые были успешно проверены и одобрены. Эти задачи можно считать завершенными и не требующими дальнейшего внимания.',
    class: 'Done',
    color: '#13c63a',
    list: doneTask.tasks,
    move: accessDragTask,
    handle: undefined,
    disabled: isLoadingTaskData.value || user.value?.role !== 'TEAM_LEADER',
  },
])

function closeFinishSprintModal() {
  isOpenedFinishSprintModal.value = false
}

function openFinishSprintModal() {
  isOpenedFinishSprintModal.value = true
}

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}

function openBurndownModal() {
  isOpenedBurndownModal.value = true
}

function closeBurndownModal() {
  isOpenedBurndownModal.value = false
}
</script>

<template>
  <div
    v-if="activeSprint"
    class="active-sprint"
  >
    <div class="active-sprint__header mt-4 mb-2 w-100">
      <div class="active-sprint__header-name border-bottom w-100">
        <div class="bs-link">
          <div
            @click="openBurndownModal"
            class="fs-5 fw-semibold cursor-pointer text-primary"
          >
            {{ activeSprint.name }}
          </div>
        </div>
        <Typography>(до {{ getFormattedDate(activeSprint.finishDate) }})</Typography>
      </div>

      <Button
        v-if="user?.role === 'TEAM_LEADER'"
        @click="openFinishSprintModal"
        class-name="active-sprint__header-button"
        variant="danger"
      >
        Завершить спринт
      </Button>
    </div>

    <div class="active-sprint__columns w-100">
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="w-100"
      >
        <div class="mb-1">
          <div
            :style="{ height: '6px', 'background-color': column.color }"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: column.color }"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>{{ column.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                v-if="column.name === 'Новые'"
                class-name="bi bi-plus active-sprint__add-task p-1 rounded"
                @click="openCreateNewTask"
              />
              <Icon
                class-name="bi bi-patch-question"
                v-tooltip="column.tooltip"
              />
            </div>
          </div>
        </div>

        <draggable
          class="list-group active-sprint__column"
          :class="column.class"
          :list="column.list"
          group="active-sprint"
          :move="column.move"
          :handle="column.handle"
          @change="moveTask"
          :disabled="column.disabled"
          :animation="200"
        >
          <template #item="{ element }">
            <ActiveSprintTask :task="element" />
          </template>
        </draggable>
      </div>
    </div>
  </div>

  <FinishProjectOrSprintModal
    v-if="project"
    :is-opened="isOpenedFinishSprintModal"
    :project="project"
    :sprint="activeSprint"
    :unfinishedTasks="unfinishedTasks"
    @close-modal="closeFinishSprintModal"
  />
  <TaskModal
    :is-opened="isOpenedCreateNewTask"
    @close-modal="closeCreateNewTask"
    :sprint="activeSprint"
  />
  <BurndownModal
    v-if="activeSprint"
    :is-opened="isOpenedBurndownModal"
    @close-modal="closeBurndownModal"
    :sprint="activeSprint"
  />
</template>

<style lang="scss" scoped>
.active-sprint {
  &__header {
    @include flexible(center, space-between);

    &-name {
      @include flexible(center, flex-start, $gap: 12px);
    }

    &-button {
      width: 100%;
      margin-left: 16px;
      max-width: fit-content;
    }
  }

  &__columns {
    @include flexible(flex-start, space-between, $gap: 16px);
  }

  &__task {
    @include textEllipsis(2);
  }

  &__add-task {
    transition: all linear 0.15s;
    -webkit-transition: all linear 0.15s;

    &:hover {
      cursor: pointer;
      color: white;
      background-color: rgb(13, 110, 253);
    }
  }

  &__column {
    height: calc(100vh - 320px);
    overflow-y: scroll;
  }
}
</style>
