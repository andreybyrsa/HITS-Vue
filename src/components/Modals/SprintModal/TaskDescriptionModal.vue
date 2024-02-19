<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

import {
  TaskDescriptionModalProps,
  TaskDescriptionModalEmits,
} from '@Components/Modals/SprintModal/TaskDescriptionModal.types'

import { SprintModalProps } from '@Components/Modals/SprintModal/SprintModal.types'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { getTaskStatus, getTaskStatusStyle } from '@Utils/getTaskStatus'

import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'
import SprintsListPage from '@Views/Project/SprintsListPage.vue'

import BurndownChart from './BurndownChart.vue'

import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

// onMounted(async () => {
//   await passTasks.value = props.sprint.tasks.filter(
//     (task) => task.status === 'Done',
//   ).length
//   allTasks.value = props.sprint.tasks.length
// })

const props = defineProps<TaskDescriptionModalProps>()
const emit = defineEmits<TaskDescriptionModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const tasks = storeToRefs(useTasksStore())

function navigateToProfileModal(id: string) {
  const profileModalRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: Profile,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(
    'projects-list',
    `/profile/ffc1b25e-8a65-4cb2-8808-6eba443acec8`,
    profileModalRoute,
  )
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="task-modal-wrapper">
      <div class="task-modal bg-white rounded p-3 d-flex flex-column">
        <div
          class="d-flex justify-content-between align-items-start border-bottom align-items-center"
        >
          <Typography class-name="fs-3 text-primary">
            {{ task?.name }}
          </Typography>
          <Button
            variant="close"
            @click="emit('close-modal')"
          />
        </div>
        <div class="d-flex">
          <div class="task-modal__left-side flex-grow-1">
            <div class="description-container mb-5 my-">
              <!-- <Typography class-name="text-primary">Описание:</Typography>
              <div class="description-box my-2">
                {{ task?.description }}
              </div> -->
            </div>
            <Collapse>
              <div class="p-2">
                {{ task?.description }}
              </div>
            </Collapse>

            <div class="task-history">
              <Typography class-name="text-primary"
                >История перемещений*:</Typography
              >
              <div class="status-history my-2">
                <div class="status new">Новая</div>
                <Icon class-name="bi bi-arrow-right fs-4" />
                <div class="status in-progress">Выполняется</div>
                <Icon class-name="bi bi-arrow-right fs-4" />
                <div class="status under-review">На проверке</div>
                <Icon class-name="bi bi-arrow-right fs-4" />
                <div class="status being-revised">На доработке</div>
                <Icon class-name="bi bi-arrow-right fs-4" />
                <div class="status completed">Выполненa</div>
              </div>
            </div>
          </div>
          <div class="idea-modal__right-side bg-white rounded">
            <div
              class="status-header bg-primary text-white text-center p-2 rounded-top"
            >
              <Typography
                class-name="p-2 bg-primary rounded-top fs-4 text-center text-white"
              >
                {{ getTaskStatus().translatedStatus[task.status] }}
                Выполнена 14.02.2024 18:39
              </Typography>
            </div>
            <div class="idea-modal__mid-side">
              <div class="d-flex align-items-center gap-1">
                <Icon class-name="bi bi-person-fill opacity-75" />
                <Typography
                  class-name="border-bottom text-secondary d-block mb-1 my-1"
                  >Постановщик:</Typography
                >
              </div>
              <div
                class="task-info__link text-primary"
                @click="navigateToProfileModal(task.initiator.id)"
              >
                <Typography class-name="text-primary d-block mb-1 my-1"
                  >{{ task?.executor?.firstName }}
                  {{ task?.executor?.lastName }}</Typography
                >
              </div>
              <div class="d-flex align-items-center gap-1">
                <Icon class-name="bi bi-person-check-fill opacity-75" />
                <Typography
                  class-name="border-bottom text-secondary d-block mb-1 my-1"
                  >Исполнитель:</Typography
                >
              </div>
              <div
                class="task-info__link text-primary"
                @click="navigateToProfileModal(task.initiator.id)"
              >
                <Typography class-name="text-primary d-block mb-1 my-1"
                  >{{ task?.executor?.firstName }}
                  {{ task?.executor?.lastName }}</Typography
                >
              </div>

              <div>
                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="bi bi-alarm opacity-75" />
                  <Typography
                    class-name="border-bottom text-secondary d-block mb-1 my-1"
                    >Трудоемкость:</Typography
                  >
                </div>
                <div>
                  <Typography class-name="text-primary d-block mb-1 my-1">{{
                    task?.workHour
                  }}</Typography>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="bi bi-tag opacity-75" />
                  <Typography
                    class-name="border-bottom text-secondary d-block mb-1 my-1"
                    >Теги:</Typography
                  >
                </div>
                <div class="tag-button mb-2 my-2">
                  <Typography class-name="tag-text text-primary">
                    {{ task?.tag }}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.task-modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.task-modal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 700px;
  gap: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  width: 1000px;
  height: 450px;
}

.status-header {
  font-size: 1.5rem;
}
.idea-modal__right-side {
  border: 1px solid rgba(121, 120, 120, 0.5);
  flex-shrink: 0;
  width: 230px;
}
.idea-modal__mid-side {
  padding-left: 10px;
}

.tag-button {
  display: inline-block;
  background-color: rgb(122, 204, 241);
  border-radius: 3px;
  padding: 2px 5px;
  margin-right: 2px;
}

.status-history {
  display: flex;
  gap: 10px;
}

.status {
  border-radius: 3px;
  padding: 2px 5px;
  margin-right: 2px;
}

.new {
  background-color: rgb(122, 204, 241);
  color: blue;
}

.in-progress {
  background-color: rgb(250, 221, 167);
  color: orange;
}

.under-review {
  background-color: rgb(243, 157, 243);
  color: purple;
}

.being-revised {
  background-color: rgb(241, 167, 167);
  color: red;
}

.completed {
  background-color: rgb(174, 250, 174);
  color: green;
}

.description-box {
  width: 90%;
  height: 120px;
  padding: 10px;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
  font-size: 14px;
  background-color: #fffcfc;
  color: black;
  border-radius: 10px;
  overflow-y: auto;
  line-height: 1.5;
}

.task-info {
  &__link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }
}
</style>
