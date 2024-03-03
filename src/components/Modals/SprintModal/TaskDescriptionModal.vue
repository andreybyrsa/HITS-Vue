<script lang="ts" setup>
import { ref } from 'vue'

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
import Input from '@Components/Inputs/Input/Input.vue'

import { getTaskStatus } from '@Utils/getTaskStatus'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY HH:mm')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

const props = defineProps<TaskDescriptionModalProps>()
const emit = defineEmits<TaskDescriptionModalEmits>()

const isLeader = props.user.role === 'TEAM_LEADER'

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
            {{ props.task.name }}
          </Typography>
          <Button
            variant="close"
            @click="emit('close-modal')"
          />
        </div>
        <div class="d-flex">
          <div class="task-modal__left-side flex-grow-1">
            <ul class="list-group rounded-3 me-3 mb-3">
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
                v-if="props.task.status === 'OnModification'"
              >
                <Button
                  variant="light"
                  class-name="collapse-controller w-100"
                  v-if="isLeader || props.task.leaderComment"
                >
                  Комментарий лидера
                </Button>
                <div v-if="isLeader">
                  <Input
                    ref="leaderComment"
                    name="leaderComment"
                    :model-value="props.task.leaderComment"
                    @input="(event: HTMLTargetEvent)=>emit('update-leader-comment', event.target.value)"
                  />
                </div>
                <div v-if="!isLeader && props.task.leaderComment">
                  <div class="p-2">
                    {{ props.task.leaderComment }}
                  </div>
                </div>
              </li>
            </ul>

            <div>
              <Typography class-name="text-primary"
                >История перемещений*:</Typography
              >
              <div class="task-history">
                <TaskHistoryTable :task-id="props.task.id" />
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
                {{ getTaskStatus().translatedStatus[props.task.status] }}
              </Typography>

              <div>
                <Typography class-name="text-light">{{
                  getFormattedDate(props.task.startDate)
                }}</Typography>
              </div>
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
                @click="navigateToProfileModal(props.task.initiator.id)"
              >
                <Typography class-name="text-primary d-block mb-1 my-1"
                  >{{ props.task.initiator?.firstName }}
                  {{ props.task.initiator?.lastName }}</Typography
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
                v-if="props.task.executor"
                class="task-info__link text-primary"
                @click="navigateToProfileModal(props.task.initiator.id)"
              >
                <Typography class-name="text-primary d-block mb-1 my-1"
                  >{{ props.task.executor?.firstName }}
                  {{ props.task.executor?.lastName }}</Typography
                >
              </div>
              <div v-else>Исполнитель не назначен</div>

              <div>
                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="bi bi-alarm opacity-75" />
                  <Typography
                    class-name="border-bottom text-secondary d-block mb-1 my-1"
                    >Трудоемкость:</Typography
                  >
                </div>
                <div>
                  <Typography class-name="d-block mb-1 my-1"
                    >{{ props.task.workHour }}ч</Typography
                  >
                </div>
                <div class="d-flex align-items-center gap-1">
                  <Icon class-name="bi bi-tag opacity-75" />
                  <Typography
                    class-name="border-bottom text-secondary d-block mb-1 my-1"
                    >Теги:</Typography
                  >
                </div>

                <div class="d-flex flex-wrap gap-2 w-100 my-2">
                  <div
                    v-for="(tag, index) in props.task.tag"
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
  max-height: fit-content;
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.status-header {
  font-size: 1.5rem;
}
.idea-modal__right-side {
  border: 1px solid rgba(121, 120, 120, 0.5);
  flex-shrink: 0;
  width: 230px;
  height: fit-content;
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
.task-history {
  max-height: 350px !important;
  overflow-y: scroll;
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
