<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import FinishSprintModal from '@Components/Modals/FinishSprintModal/FinishSprintModal.vue'

import { ActiveSprintProps } from '@Views/Project/Project.types'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import sprintsStore from '@Store/projects/projectsStore'
import useUserStore from '@Store/user/userStore'

import { Task, Sprint, TaskMovementLog } from '@Domain/Project'
import TaskService from '@Services/TaskService'
import { reactiveComputed, useDateFormat, watchImmediate } from '@vueuse/core'
import useTasksStore from '@Store/tasks/tasksStore'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'
import SprintModal from '@Components/Modals/SprintModal/SprintModal.vue'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import TaskDescriptionModal from '@Components/Modals/SprintModal/TaskDescriptionModal.vue'
import { SprintModalProps } from '@Components/Modals/SprintModal/SprintModal.types'
import useSprintsStore from '@Store/sprints/sprintsStore'

const props = defineProps<ActiveSprintProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const taskStore = useTasksStore()
const { tasks } = storeToRefs(taskStore)

const sprintStore = useSprintsStore()
const { sprints } = storeToRefs(sprintStore)

const checkMyInProgressTask = ref(false)
const isLoadingTaskData = ref(false)

const isOpenedCreateNewTask = ref(false)

const isOpenedFinishSprintModal = ref(false)
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

const refValue = ref()

const onModificationTask = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status === 'OnModification'),
)
const newTask = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status === 'NewTask'),
)
const inProgressTask = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status === 'inProgress'),
)
const onVerificationTask = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status === 'OnVerification'),
)
const doneTask = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status === 'Done'),
)

const tasksArray = computed<Task[][]>(() => {
  return [onModificationTask, newTask, inProgressTask, onVerificationTask, doneTask]
})

const currentSprint = ref<Sprint>()
const isOpenedSprinttModal = ref(false)

const logs = ref<TaskMovementLog[]>()

async function getLogs(taskId: string) {
  const currentUser = user.value

  if (currentUser) {
    const { token } = currentUser

    if (token) {
      const taskLogs = await TaskService.getTaskMovementLog(taskId, token)

      if (taskLogs instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', taskLogs.message)
      } else {
        logs.value = taskLogs
        console.log(logs)
      }
    }
  }
  return logs
}

async function moveTask(evt: any) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    if (evt.added) {
      const task: Task = evt.added.element
      const { id: taskId } = task
      console.log(task.status, 1)
      const currentArrayTask = tasksArray.value.find((arrayTasks) =>
        arrayTasks.includes(task),
      )

      if (currentArrayTask === onModificationTask) {
        const onModificationTaskParallelRequests: RequestConfig[] = [
          {
            request: () =>
              taskStore.changeTaskStatus(taskId, 'OnModification', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () =>
              taskStore.createTaskLog(taskId, user.value, 'OnModification', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
        ]

        await sendParallelRequests(onModificationTaskParallelRequests)
      }

      if (currentArrayTask === inProgressTask) {
        const inProgressTaskParallelRequests: RequestConfig[] = [
          {
            request: () => taskStore.changeExecutorTask(taskId, user.value, token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () => taskStore.changeTaskStatus(taskId, 'inProgress', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () =>
              taskStore.createTaskLog(taskId, user.value, 'inProgress', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
        ]

        await sendParallelRequests(inProgressTaskParallelRequests)
      }

      if (currentArrayTask === newTask) {
        const newTaskParallelRequests: RequestConfig[] = [
          {
            request: () => taskStore.changeExecutorTask(taskId, null, token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () => taskStore.changeTaskStatus(taskId, 'NewTask', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () =>
              taskStore.createTaskLog(taskId, user.value, 'NewTask', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
        ]
        await sendParallelRequests(newTaskParallelRequests)
      }

      if (currentArrayTask === onVerificationTask) {
        const onVerificationTaskParallelRequests: RequestConfig[] = [
          {
            request: () =>
              taskStore.changeTaskStatus(taskId, 'OnVerification', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () =>
              taskStore.createTaskLog(taskId, user.value, 'OnVerification', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
        ]

        await sendParallelRequests(onVerificationTaskParallelRequests)
      }

      if (currentArrayTask === doneTask) {
        const doneTaskParallelRequests: RequestConfig[] = [
          {
            request: () => taskStore.changeTaskStatus(taskId, 'Done', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
          {
            request: () =>
              taskStore.createTaskLog(taskId, user.value, 'Done', token),
            refValue: refValue,
            onErrorFunc: openErrorNotification,
          },
        ]

        await sendParallelRequests(doneTaskParallelRequests)
      }

      isLoadingTaskData.value = false
    }
  }
}

watchImmediate(inProgressTask, () => {
  const currentMyInProgressTask = inProgressTask.find(
    ({ executor }) => executor?.id == user.value?.id,
  )
  checkMyInProgressTask.value = currentMyInProgressTask ? true : false
})

function checkUserTask(evt: any) {
  return evt.draggedContext.element.executor.id === user.value?.id
}

function getExecutorTask(taskId: string) {
  const currentTask = tasks.value.find(({ id }) => id === taskId)
  if (currentTask?.executor)
    return `${currentTask.executor.firstName} ${currentTask.executor.lastName}`
}

function checkOnModificationTask(evt: any) {
  const isCheckMyTask: boolean =
    evt.draggedContext.element.executor.id === user.value?.id
  const inProgressTask = tasks.value.find(
    ({ status, executor }) =>
      status === 'inProgress' && executor?.id === user.value?.id,
  )

  return inProgressTask ? false : isCheckMyTask
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

function getColorBand(task: Task) {
  return task.executor?.id === user.value?.id ? '#0D6EFD' : '#9E9E9E'
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function openModalSprint(sprint: Sprint) {
  isOpenedSprinttModal.value = true
  if (sprint) {
    currentSprint.value = sprint
  }
}

function closeSprintModal() {
  isOpenedSprinttModal.value = false
}

const isOpenedTaskModal = ref(false)
const currentTask = ref<Task>()

function openTaskModal(task: Task) {
  if (task) {
    currentTask.value = task
    isOpenedTaskModal.value = true
  }
}

function closeTaskModal() {
  isOpenedTaskModal.value = false
}

// const wildcardTask = ref({
//   id: '1',
//   sprintId: '1',
//   projectId: '1',
//   position: 1,
//   name: 'Scram проекты',
//   description:
//     'Сделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проектыСделать скрам проекты',
//   initiator: { lastName: 'Кирилл', firstName: 'Власов' },
//   executor: { lastName: 'Кирилл', firstName: 'Власов' },
//   workHour: '3 часа',
//   startDate: '2022-01-01',
//   finishDate: '2022-01-02',
//   tag: 'Фронтенд',
//   taskMovementLog: ['Выполняется', 'В бэклоге', 'На доработке', 'Выполнена'],
//   status: 'Выполняется',
// })
</script>

<template>
  <div
    v-if="sprint.status == 'ACTIVE'"
    class="active-sprint"
  >
    <!-- <button @click="getLogs('0')">get logs</button> -->
    <div class="active-sprint__header my-4 p-2 border rounded w-100">
      <div class="d-flex gap-2 align-items-center">
        <div
          class="bs-link mb-1 fw-semibold text-primary"
          @click="openModalSprint(sprint)"
        >
          <Typography class-name="fs-5 fw-semibold cursor-pointer">
            {{ sprint.name }}
            {{ sprint.status }}
          </Typography>
        </div>
        <SprintModal
          :is-opened="isOpenedSprinttModal"
          :sprint="currentSprint"
          @close-modal="closeSprintModal"
        />
        <Typography>(до {{ getFormattedDate(sprint.finishDate) }})</Typography>
      </div>
      <div class="d-flex gap-2">
        <Button
          variant="primary"
          @click="openCreateNewTask"
          >Новая задача</Button
        >
        <Button
          v-if="user?.role === 'TEAM_LEADER'"
          @click="openFinishSprintModal"
          variant="danger"
          >Завершить спринт</Button
        >
      </div>
    </div>

    <div class="active-sprint__columns w-100">
      <div class="w-100">
        <div class="mb-1">
          <div
            style="height: 6px; background-color: blueviolet"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                style="color: blueviolet"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>На доработке</Typography>
            </div>
            <Icon
              class-name="bi bi-patch-question"
              v-tooltip="
                'Здесь находятся задачи, которые были отправлены на доработку для исправления ошибок или улучшения качества. Эти задачи нужно выполнить в первую очередь, чтобы не затягивать сроки проекта.'
              "
            />
          </div>
        </div>

        <draggable
          class="list-group active-sprint"
          :list="onModificationTask"
          group="people"
          :move="checkOnModificationTask"
          @change="moveTask"
          :disabled="isLoadingTaskData"
          :animation="200"
        >
          <template #item="{ element }">
            <div
              class="d-flex my-1"
              @click="openTaskModal(element)"
            >
              <div
                :style="{ width: '6px', backgroundColor: getColorBand(element) }"
                class="rounded-start"
              />
              <div
                class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
              >
                <div class="d-flex flex-column border-bottom pb-2">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                  <div class="d-flex gap-1 text-secondary">
                    {{ getExecutorTask(element.id) ?? 'нет испольнителя' }}
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2 w-100 mt-2">
                  <div
                    v-for="(tag, index) in element.tag"
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
            </div>
          </template>
        </draggable>
      </div>

      <div class="w-100">
        <div class="mb-1">
          <div
            style="height: 6px; background-color: #0d6efd"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                style="color: #0d6efd"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>Новые</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                class-name="bi bi-plus active-sprint__add-task p-1 rounded"
                @click="openCreateNewTask"
              />
              <Icon
                class-name="bi bi-patch-question"
                v-tooltip="
                  'Здесь находятся задачи, которые еще не были назначены команде или отдельному разработчику. Эти задачи можно выбирать по своему усмотрению, учитывая приоритеты и сложность.'
                "
              />
            </div>
          </div>
        </div>

        <draggable
          class="list-group active-sprint"
          :list="newTask"
          group="people"
          @change="moveTask"
          :handle="checkMyInProgressTask"
          :disabled="isLoadingTaskData"
          :animation="200"
        >
          <template #item="{ element }">
            <div
              class="d-flex my-1"
              @click="openTaskModal(element)"
            >
              <div
                :style="{ width: '6px', backgroundColor: getColorBand(element) }"
                class="rounded-start"
              />
              <div
                class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
              >
                <div class="d-flex flex-column border-bottom pb-2">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2 w-100 mt-2">
                  <div
                    v-for="(tag, index) in element.tag"
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
            </div>
          </template>
        </draggable>
      </div>

      <div class="w-100">
        <div class="mb-1">
          <div
            style="height: 6px; background-color: #f5ec0a"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                style="color: #f5ec0a"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>На выполнении</Typography>
            </div>
            <Icon
              class-name="bi bi-patch-question"
              v-tooltip="
                'Здесь находятся задачи, которые в данный момент выполняются командой или отдельным разработчиком. Эти задачи нужно довести до конца и не переключаться на другие, пока они не будут готовы к проверке.'
              "
            />
          </div>
        </div>

        <draggable
          class="list-group active-sprint"
          :list="inProgressTask"
          group="people"
          :move="checkUserTask"
          @change="moveTask"
          :disabled="isLoadingTaskData"
          :animation="200"
        >
          <template #item="{ element }">
            <div
              class="d-flex my-1"
              @click="openTaskModal(element)"
            >
              <div
                :style="{ width: '6px', backgroundColor: getColorBand(element) }"
                class="rounded-start"
              />
              <div
                class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
              >
                <div class="d-flex flex-column border-bottom pb-2">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                  <div class="d-flex gap-1 text-secondary">
                    {{ getExecutorTask(element.id) ?? 'нет испольнителя' }}
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2 w-100 mt-2">
                  <div
                    v-for="(tag, index) in element.tag"
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
            </div>
          </template>
        </draggable>
      </div>

      <div class="w-100">
        <div class="mb-1">
          <div
            style="height: 6px; background-color: #ffa800"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                style="color: #ffa800"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>На проверке</Typography>
            </div>
            <Icon
              class-name="bi bi-patch-question"
              v-tooltip="
                'Здесь находятся задачи, которые были выполнены и отправлены на проверку качества, функциональности и соответствия требованиям. Эти задачи должны проверяться тимлидом команды.'
              "
            />
          </div>
        </div>

        <draggable
          class="list-group active-sprint"
          :list="onVerificationTask"
          group="people"
          @change="moveTask"
          :animation="200"
          :disabled="isLoadingTaskData"
          :handle="user?.role !== 'TEAM_LEADER'"
        >
          <template #item="{ element }">
            <div
              class="d-flex my-1"
              @click="openTaskModal(element)"
            >
              <div
                :style="{ width: '6px', backgroundColor: getColorBand(element) }"
                class="rounded-start"
              />
              <div
                class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
              >
                <div class="d-flex flex-column border-bottom pb-2">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                  <div class="d-flex gap-1 text-secondary">
                    {{ getExecutorTask(element.id) ?? 'нет испольнителя' }}
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2 w-100 mt-2">
                  <div
                    v-for="(tag, index) in element.tag"
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
            </div>
          </template>
        </draggable>
      </div>

      <div class="w-100">
        <div class="mb-1">
          <div
            style="height: 6px; background-color: #13c63a"
            class="rounded-top"
          />
          <div
            class="active-sprint__header p-2 border-start border-end border-bottom rounded-bottom"
          >
            <div class="d-flex gap-2">
              <Icon
                style="color: #13c63a"
                class-name="bi bi-flag-fill fs-6"
              />
              <Typography>Выполненные</Typography>
            </div>
            <Icon
              class-name="bi bi-patch-question"
              v-tooltip="
                'Здесь находятся задачи, которые были успешно проверены и одобрены. Эти задачи можно считать завершенными и не требующими дальнейшего внимания.'
              "
            />
          </div>
        </div>

        <draggable
          class="list-group active-sprint"
          :list="doneTask"
          @change="moveTask"
          group="people"
          :animation="200"
          :disabled="isLoadingTaskData || user?.role !== 'TEAM_LEADER'"
        >
          <template #item="{ element }">
            <div
              class="d-flex my-1"
              @click="openTaskModal(element)"
            >
              <div
                :style="{ width: '6px', backgroundColor: getColorBand(element) }"
                class="rounded-start"
              />
              <div
                class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
              >
                <div class="d-flex flex-column border-bottom pb-2">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                  <div class="d-flex gap-1 text-secondary">
                    {{ getExecutorTask(element.id) ?? 'нет испольнителя' }}
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2 w-100 mt-2">
                  <div
                    v-for="(tag, index) in element.tag"
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
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <FinishSprintModal
      isFinishSprint
      :is-opened="isOpenedFinishSprintModal"
      :active-sprint="sprint"
      @close-modal="closeFinishSprintModal"
    />

    <TaskModal
      :is-opened="isOpenedCreateNewTask"
      @close-modal="closeCreateNewTask"
    />
  </div>
  <TaskDescriptionModal
    :is-opened="isOpenedTaskModal"
    :task="currentTask"
    @close-modal="closeTaskModal"
  />
</template>

<style lang="scss" scoped>
.active-sprint {
  min-height: 70vh;

  &__header {
    @include flexible(center, space-between);
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
}
</style>
