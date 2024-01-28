<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

import { ActiveSprintProps } from '@Views/Project/Project.types'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

import { Task } from '@Domain/Project'
import { reactiveComputed, watchImmediate } from '@vueuse/core'
import useTasksStore from '@Store/tasks/tasksStore'

defineProps<ActiveSprintProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const taskStore = useTasksStore()
const { tasks } = storeToRefs(taskStore)

const onModificationTask = reactiveComputed<Task[]>(
  () =>
    tasks.value.filter(
      ({ status, sprintId }) => status === 'OnModification' && sprintId === '3',
    ) ?? [],
)
const newTask = reactiveComputed<Task[]>(
  () =>
    tasks.value.filter(
      ({ status, sprintId }) => status === 'NewTask' && sprintId === '3',
    ) ?? [],
)
const inProgressTask = reactiveComputed<Task[]>(
  () =>
    tasks.value.filter(
      ({ status, sprintId }) => status === 'inProgress' && sprintId === '3',
    ) ?? [],
)
const onVerificationTask = reactiveComputed<Task[]>(
  () =>
    tasks.value.filter(
      ({ status, sprintId }) => status === 'OnVerification' && sprintId === '3',
    ) ?? [],
)
const doneTask = reactiveComputed<Task[]>(
  () =>
    tasks.value.filter(
      ({ status, sprintId }) => status === 'Done' && sprintId === '3',
    ) ?? [],
)

const tasksArray = computed<Task[][]>(() => {
  return [onModificationTask, newTask, inProgressTask, onVerificationTask, doneTask]
})

function checkUserTask(evt: any) {
  return evt.draggedContext.element.executor.id === user.value?.id
}

async function moveTask(evt: any) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    if (evt.added) {
      const task: Task = evt.added.element
      const { id: taskId } = task

      const currentArrayTask = tasksArray.value.find((arrayTasks) =>
        arrayTasks.includes(task),
      )

      if (currentArrayTask === onModificationTask) {
        await useTasksStore().changeTaskStatus(taskId, 'OnModification', token)
      }

      if (currentArrayTask === inProgressTask) {
        await useTasksStore().changeExecutorTask(taskId, user.value, token)
        await useTasksStore().changeTaskStatus(taskId, 'inProgress', token)
      }

      if (currentArrayTask === newTask) {
        await useTasksStore().changeExecutorTask(taskId, null, token)
        await useTasksStore().changeTaskStatus(taskId, 'NewTask', token)
      }

      if (currentArrayTask === onVerificationTask) {
        await useTasksStore().changeTaskStatus(taskId, 'OnVerification', token)
      }

      if (currentArrayTask === doneTask) {
        await useTasksStore().changeTaskStatus(taskId, 'Done', token)
      }
    }
  }
}

function getExecutorTask(taskId: string) {
  const currentTask = tasks.value.find(({ id }) => id === taskId)
  if (currentTask?.executor)
    return `${currentTask.executor.firstName} ${currentTask.executor.lastName}`
}

const checkUserInProgressTask = computed(() => {
  return inProgressTask.find(({ executor }) => executor?.id == user.value?.id)
    ? true
    : false
})

function checkOnModificationTask(evt: any) {
  const inProgressTask = tasks.value.find(
    ({ status, executor }) =>
      status === 'inProgress' && executor?.id === user.value?.id,
  )

  if (inProgressTask) {
    return false
  } else {
    return evt.draggedContext.element.executor.id === user.value?.id
  }
}

const isDisabledNewTask = computed(() => {
  return checkUserInProgressTask.value ? true : false
})
</script>

<template>
  <div class="active-sprint__header w-100 mt-4 mb-2">
    <Button
      variant="link"
      class-name="fs-5"
    >
      {{ sprint.name }}
    </Button>
    <Button variant="danger">Завершить спринт</Button>
  </div>

  <div class="active-sprint w-100">
    <div class="active-sprint__column border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">На доработке</Typography>
      <draggable
        class="list-group"
        :list="onModificationTask"
        group="people"
        :move="checkOnModificationTask"
        @change="moveTask"
        :animation="200"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon class-name="bi bi-circle-fill fs-6" />
              <Typography>
                {{ getExecutorTask(element.id) }}
              </Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <div class="active-sprint__header w-100">
        <Typography class-name="fs-5 text-primary">Новые</Typography>
        <Button variant="outline-primary">
          <Icon class-name="bi bi-plus fs-6" />
        </Button>
      </div>
      <draggable
        class="list-group"
        :list="newTask"
        group="people"
        @change="moveTask"
        :handle="checkUserInProgressTask"
        :animation="200"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">Выполняются</Typography>
      <draggable
        class="list-group"
        :list="inProgressTask"
        group="people"
        :move="checkUserTask"
        @change="moveTask"
        :animation="200"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon class-name="bi bi-circle-fill fs-6" />
              <Typography>
                {{ getExecutorTask(element.id) ?? 'назначается испольнитель' }}
              </Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">На проверке</Typography>
      <draggable
        class="list-group"
        :list="onVerificationTask"
        group="people"
        @change="moveTask"
        :animation="200"
        :handle="user?.role !== 'TEAM_LEADER'"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon class-name="bi bi-circle-fill fs-6" />
              <Typography>
                {{ getExecutorTask(element.id) }}
              </Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">Выполнены</Typography>
      <draggable
        class="list-group"
        :list="doneTask"
        @change="moveTask"
        group="people"
        :animation="200"
        :disabled="user?.role !== 'TEAM_LEADER'"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon class-name="bi bi-circle-fill fs-6" />
              <Typography>
                {{ getExecutorTask(element.id) }}
              </Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-sprint {
  @include flexible(flex-start, space-between, $gap: 16px);

  &__header {
    @include flexible(center, space-between);
  }

  &__task {
    @include textEllipsis(2);
  }

  &__header {
    @include flexible(flex-start, space-between);
  }
}
.draggable {
  height: 100%;
}
</style>
