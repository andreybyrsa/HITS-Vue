<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { RouteRecordRaw } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

import {
  TaskDescriptionModalProps,
  TaskDescriptionModalEmits,
} from '@Components/Modals/SprintModal/TaskDescriptionModal.types'

import Button from '@Components/Button/Button.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'
import TaskHistoryTable from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.vue'
import EditTaskModal from './EditTaskModal.vue'

import useUserStore from '@Store/user/userStore'

import { getTaskStatus } from '@Utils/getTaskStatus'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

import { Task } from '@Domain/Project'

const props = defineProps<TaskDescriptionModalProps>()
const emit = defineEmits<TaskDescriptionModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedEditTask = ref(false)
const updatingTask = ref<Task>()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY HH:mm')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

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

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}

function getBackgroundColor(status: string) {
  switch (status) {
    case 'NewTask':
      return '#0d6efd'
    case 'InProgress':
      return '#f5ec0a'
    case 'OnVerification':
      return '#ffa800'
    case 'Done':
      return '#13c63a'
    default:
      return 'blueviolet'
  }
}

function getTextColor(status: string) {
  switch (status) {
    case 'NewTask':
    case 'OnModification':
    case 'Done':
      return '#FFFFFF'
    default:
      return '#212529'
  }
}

function openEditTaskModal(task: Task) {
  updatingTask.value = task
  isOpenedEditTask.value = true
  emit('close-modal')
}

function closeUpdateNewTask() {
  isOpenedEditTask.value = false
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="edit-task-model border rounded-3 bg-white px-3 py-2">
      <div class="edit-task-model__header w-100">
        <div
          class="d-flex justify-content-between align-items-start border-bottom align-items-center w-100"
        >
          <Typography class-name="fs-3 text-primary d-flex mx-1">
            {{ props.task.name }}
          </Typography>

          <Button
            variant="close"
            @click="emit('close-modal')"
          />
        </div>
      </div>

      <div class="d-flex w-100">
        <div
          class="edit-task-model__left-side"
          :style="{
            maxHeight:
              user.role === 'TEAM_LEADER' || user.id === props.task.executor?.id
                ? '410.21px'
                : '372.44px',
          }"
        >
          <ul class="list-group rounded-3 me-3 mb-3 w-100">
            <li class="list-group-item p-0 overflow-hidden">
              <Button
                variant="light"
                class-name="collapse-controller w-100"
                v-collapse:openOnMount="props.task.id"
              >
                Описание
              </Button>
              <Collapse :id="props.task.id">
                <div class="p-2">{{ props.task.description }}</div>
              </Collapse>
            </li>

            <li
              class="list-group-item p-0 overflow-hidden"
              v-if="
                props.task.status === 'OnModification' && props.task.leaderComment
              "
            >
              <Button
                variant="light"
                class-name="collapse-controller w-100"
                v-collapse:openOnMount="'leaderComment_' + props.task.id"
              >
                Комментарий лидера
              </Button>
              <Collapse :id="'leaderComment_' + props.task.id">
                <div class="p-2">
                  {{ props.task.leaderComment }}
                </div>
              </Collapse>
            </li>
          </ul>

          <div style="padding-left: 8px">
            <Typography class-name="text-primary">История перемещений*:</Typography>
            <div class="task-history">
              <TaskHistoryTable :task-id="props.task.id" />
            </div>
          </div>
        </div>

        <div class="edit-task-model__right-side">
          <div
            class="mb-2 border-start rounded-top border-end border-bottom rounded-bottom"
          >
            <div
              class="task-information__header text-center rounded-top"
              :style="{
                backgroundColor: getBackgroundColor(props.task.status),
              }"
            >
              <div
                class="d-flex row"
                :style="{ color: getTextColor(props.task.status) }"
              >
                <Typography class-name="py-2 px-0 fs-4">
                  {{ getTaskStatus().translatedStatus[props.task.status] }}
                </Typography>
                <Typography class-name="pb-2 px-0 border-bottom">
                  {{ getFormattedDate(props.task.startDate) }}
                </Typography>
              </div>
            </div>

            <div class="task-information__middle-side p-3 d-flex flex-column gap-2">
              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Icon class-name="bi bi-person-fill opacity-75" />
                  <Typography class-name="text-secondary d-block">
                    Постановщик:
                  </Typography>
                </div>

                <div class="d-flex align-items-center gap-1">
                  <div @click="navigateToProfileModal(props.task.initiator.id)">
                    <Typography class-name="text-primary d-block">
                      {{ props.task.initiator?.firstName }}
                      {{ props.task.initiator?.lastName }}
                    </Typography>
                  </div>
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Icon class-name="bi bi-person-check-fill opacity-75" />
                  <Typography class-name="text-secondary d-block">
                    Исполнитель:
                  </Typography>
                </div>

                <div class="d-flex align-items-center gap-1">
                  <div
                    v-if="props.task.executor"
                    @click="navigateToProfileModal(props.task.initiator.id)"
                  >
                    <Typography class-name="text-primary d-block"
                      >{{ props.task.executor?.firstName }}
                      {{ props.task.executor?.lastName }}</Typography
                    >
                  </div>
                  <div v-else>Исполнитель не назначен</div>
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Icon class-name="bi bi-alarm opacity-75" />
                  <Typography class-name="text-secondary d-block">
                    Трудоемкость:
                  </Typography>
                  <Typography class-name="d-block mb-1 my-1"
                    >{{ props.task.workHour }}ч</Typography
                  >
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Icon class-name="bi bi-tag opacity-75" />
                  <Typography class-name="text-secondary d-block">
                    Теги:
                  </Typography>
                </div>

                <div class="d-flex flex-wrap gap-2 w-100 my-2 mb-1">
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

              <div
                class="px-2 mt-2"
                v-if="
                  user.id === props.task.executor?.id || user.role === 'TEAM_LEADER'
                "
              >
                <Button
                  variant="primary"
                  class-name="w-100"
                  @click="openEditTaskModal(task)"
                >
                  Редактировать задачу
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
  <EditTaskModal
    :is-opened="isOpenedEditTask"
    :task="updatingTask"
    @close-modal="closeUpdateNewTask"
  />
</template>

<style lang="scss" scoped>
.edit-task-model {
  width: 1000px;
  display: flex;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  &__left-side {
    flex: 70%;
    margin-right: 8px;
    max-height: 410.22px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__right-side {
    flex: 30%;
    margin-left: 8px;
  }
}
.task-information {
  font-size: 1.5rem;

  &__header {
    width: 100%;
    overflow: hidden;
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
