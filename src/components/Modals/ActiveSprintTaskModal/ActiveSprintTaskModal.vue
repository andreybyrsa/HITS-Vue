<script lang="ts" setup>
import { onMounted, ref, VueElement } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TaskHeader from '@Components/Modals/ActiveSprintTaskModal/TaskHeader.vue'
import TaskData from '@Components/Modals/ActiveSprintTaskModal/TaskData.vue'
import TaskHistory from '@Components/Modals/ActiveSprintTaskModal/TaskHistory.vue'
import TaskInfo from '@Components/Modals/ActiveSprintTaskModal/TaskInfo.vue'
import TaskComments from '@Components/Modals/ActiveSprintTaskModal/TaskComments.vue'

import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'

import { Task } from '@Domain/Project'

import TaskService from '@Services/TaskService'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const tasksStore = useTasksStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const isOpened = ref<boolean>(false)
const ActiveSprintTaskModalRef = ref<VueElement | null>(null)
const task = ref<Task>()

onMounted(async () => {
  const currentUser = user.value

  setTimeout(() => (isOpened.value = true), 10)

  if (currentUser?.token) {
    const { token } = currentUser
    const taskId = route.params.taskId.toString()

    const response = await TaskService.getTask(taskId, token)

    if (response instanceof Error) {
      useNotificationsStore().createSystemNotification('Система', response.message)
      return
    }

    task.value = response
  }
})

function closeModal() {
  isOpened.value = false
  router.push({ name: 'project' })
}

const changeLeaderComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const currentTask = task.value

  if (currentUser?.token && currentTask) {
    const { token } = currentUser
    const { id } = currentTask

    tasksStore.changeLeaderComment(id, input, token)
    currentTask.leaderComment = input
  }
}, 450)

const changeExecutorComment = useDebounceFn((input: string) => {
  const currentUser = user.value
  const currentTask = task.value

  if (currentUser?.token && currentTask) {
    const { token } = currentUser
    const { id } = currentTask

    tasksStore.changeExecutorComment(id, input, token)
  }
}, 450)
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    appear-on-render
    @on-outside-close="closeModal"
  >
    <div
      v-if="task"
      ref="ActiveSprintTaskModalRef"
      class="task-modal p-3"
    >
      <div class="task-modal__left-side w-75">
        <TaskHeader @close-modal="closeModal" />

        <TaskData :task="task" />

        <TaskHistory :task-id="task.id" />
      </div>
      <div class="task-modal__right-side w-25">
        <TaskInfo :task="task" />

        <TaskComments
          :task="task"
          @update-leader-comment="changeLeaderComment"
          @update-executor-comment="changeExecutorComment"
        />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.task-modal {
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  overflow-y: scroll;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: 100%;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .task-modal,
.modal-layout-leave-to .task-modal {
  transform: translateX(100%);
}
</style>
