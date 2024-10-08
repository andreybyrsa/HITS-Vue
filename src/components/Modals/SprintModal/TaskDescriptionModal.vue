<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import { RouteRecordRaw } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

import {
  TaskDescriptionModalProps,
  TaskDescriptionModalEmits,
} from '@Components/Modals/SprintModal/TaskDescriptionModal.types'

import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import Validation from '@Utils/Validation'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'
import TaskHistoryTable from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.vue'
import EditTaskModal from './EditTaskModal.vue'

import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'

import { getTaskStatus } from '@Utils/getTaskStatus'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import { Task } from '@Domain/Project'

const props = defineProps<TaskDescriptionModalProps>()
const emit = defineEmits<TaskDescriptionModalEmits>()

const userStore = useUserStore()
const tasksStore = useTasksStore()
const { user } = storeToRefs(userStore)

const isOpenedEditTask = ref(false)
const updatingTask = ref<Task>()
const inputMode = ref(false)
const inputModeLeader = ref(false)

function convertToInput(comment: string) {
  if (comment === 'leader' && user.value?.role === 'TEAM_LEADER') {
    inputModeLeader.value = true
  } else if (comment === 'executor' && user.value?.id === props.task.executor?.id) {
    inputMode.value = true
  } else return
}

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

const { handleSubmit, setValues } = useForm<Task>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

watch(
  () => props.task,
  (task) => {
    setValues({ ...task })
  },
)
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
              user?.role === 'TEAM_LEADER' || user?.id === props.task.executor?.id
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
                props.task.status === 'OnModification' ||
                (props.task.status === 'OnVerification' &&
                  props.task.leaderComment) ||
                (props.task.status === 'InProgress' && props.task.leaderComment)
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
                <div
                  class="p-2"
                  v-if="props.task.leaderComment && !inputModeLeader"
                  @click="convertToInput('leader')"
                >
                  {{ props.task.leaderComment }}
                </div>
                <div
                  class="p-2"
                  v-else-if="!$props.task.leaderComment && !inputModeLeader"
                  @click="convertToInput('leader')"
                >
                  Комментарий не добавлен
                </div>
                <div v-if="inputModeLeader">
                  <Textarea
                    name="leaderComment"
                    placeholder="Комментарий"
                    class-name="edit-task-model__comment rounded"
                    :model-value="props.task.leaderComment"
                    @blur="inputModeLeader = false"
                    @keyup.enter="(event: HTMLTargetEvent)=> {
                      emit('update-leader-comment', event.target.value); inputModeLeader = false}"
                  />
                </div>
              </Collapse>
            </li>

            <li
              class="list-group-item p-0 overflow-hidden"
              v-if="
                props.task.status === 'OnVerification' ||
                props.task.status === 'OnModification' ||
                (props.task.status === 'InProgress' && props.task.executorComment)
              "
            >
              <Button
                variant="light"
                class-name="collapse-controller w-100"
                v-collapse:openOnMount="'executorComment_' + props.task.id"
              >
                Комментарий к задаче
              </Button>
              <Collapse :id="'executorComment_' + props.task.id">
                <div v-if="props.task.executorComment && !inputMode">
                  <div
                    class="p-2"
                    @click="convertToInput('executor')"
                  >
                    {{ props.task.executorComment }}
                  </div>
                </div>

                <div v-else-if="!props.task.executorComment && !inputMode">
                  <div
                    class="p-2"
                    @click="convertToInput('executor')"
                  >
                    Комментарий не добавлен
                  </div>
                </div>
                <div v-if="inputMode">
                  <Textarea
                    placeholder="Комментарий"
                    name="executorComment"
                    class-name="edit-task-model__comment rounded"
                    :model-value="$props.task?.executorComment"
                    @blur="inputMode = false"
                    @keyup.enter="(event: HTMLTargetEvent)=>{
                      emit('update-executor-comment', event.target.value);
                      inputMode = false }"
                    validate-on-update
                  />
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
                  <Typography class-name="text-secondary d-block">
                    Постановщик
                  </Typography>
                </div>

                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="icon bi bi-person-circle fs-3 opacity-25" />
                  <div @click="navigateToProfileModal(props.task.initiator.id)">
                    <Typography class-name="fs-6 text-primary d-block">
                      {{ props.task.initiator?.firstName }}
                      {{ props.task.initiator?.lastName }}
                    </Typography>
                  </div>
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Typography class-name="text-secondary d-block">
                    Исполнитель
                  </Typography>
                </div>

                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="icom fs-3 bi bi-person-circle opacity-25" />
                  <div
                    v-if="props.task.executor"
                    @click="navigateToProfileModal(props.task.initiator.id)"
                  >
                    <Typography class-name="fs-6 text-primary d-block"
                      >{{ props.task.executor?.firstName }}
                      {{ props.task.executor?.lastName }}</Typography
                    >
                  </div>
                  <div
                    v-else
                    class="fs-6 text-primary"
                  >
                    <Typography class-name="fs-6 text-primary d-block"
                      >Исполнитель не назначен</Typography
                    >
                  </div>
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Typography class-name="text-secondary d-block">
                    Трудоемкость
                  </Typography>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="icon fs-3 bi bi-alarm opacity-25" />
                  <Typography class-name="fs-6 text-primary d-block mb-1 my-1"
                    >{{ props.task.workHour }} ч</Typography
                  >
                </div>
              </div>

              <div class="px-2">
                <div class="d-flex align-items-center mb-2 pb-1 border-bottom gap-1">
                  <Typography class-name="text-secondary d-block">Теги</Typography>
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
                  user?.id === props.task.executor?.id ||
                  user?.role === 'TEAM_LEADER'
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

<style lang="scss">
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
    min-height: 422.4px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__right-side {
    flex: 30%;
    margin-left: 8px;
  }

  &__comment {
    resize: none;
    height: 90px;
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
  border-radius: 0 !important;
  background-color: $white-color !important;
  justify-content: flex-start !important;

  color: $primary-color !important;
}
</style>
