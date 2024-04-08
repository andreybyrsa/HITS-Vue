<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import {
  SprintInfoModalProps,
  SprintInfoModalEmits,
} from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'
import SprintTaskStatsPage from '@Views/Project/SprintTaskStatsPage.vue'

import { ref } from 'vue'
import SprintStatsPage from '@Views/Project/SprintStatsPage.vue'
import SprintTaskStats from '@Views/Project/SprintTaskStats.vue'
import { Task } from '@Domain/Project'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<SprintInfoModalProps>()
const emit = defineEmits<SprintInfoModalEmits>()

function getNavLinkStyle(isCurrentTab: boolean) {
  return [
    'nav-link',
    'fw-normal',
    'pb-1',
    'cursor-pointer',
    { 'active text-primary': isCurrentTab },
    { 'text-secondary': !isCurrentTab },
  ]
}

const isTabAboutSprint = ref(true)
const isTabAboutTask = ref(false)

const currentTask = ref<Task>()

function openTabAboutTask(task: Task) {
  if (task) {
    currentTask.value = task
  }

  isTabAboutSprint.value = false
  isTabAboutTask.value = true
}

function undefinedTask() {
  currentTask.value = undefined
}

function switchToTabAboutSprint() {
  isTabAboutSprint.value = true
  isTabAboutTask.value = false
  currentTask.value = undefined
}
</script>
<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    ><div class="sprint-info-modal bg-white rounded bg-white p-3 w-1 flex-column">
      <div class="sprint-info-modal__header fs-2 w-100 border-2">
        <Typography class-name="text-primary fs-3 w-100"
          >{{ props.sprint?.name }}
        </Typography>

        <Button
          variant="close"
          class="close"
          @click="emit('close-modal')"
        />
      </div>

      <div class="d-flex w-100 h-100 gap-3">
        <div class="flex-column gap-2 h-100">
          <Typography class-name="fs-4 text-primary border-bottom w-100"
            >{{ 'Задачи: ' }} {{ props.sprint?.tasks.length }}
          </Typography>
          <div class="w-100 rounded-3">
            <Input
              :name="props.sprint?.id"
              class-name="rounded finish-project-modal__input"
              placeholder="Поиск"
              validate-on-update
            />
          </div>
          <div class="sprint-info-modal__tasks overflow-scroll w-100">
            <div
              v-for="(task, index) in props.sprint.tasks"
              :key="index"
              class="w-100 p-1"
            >
              {{ console.log(task) }}
              <div
                variant="outline-secondary"
                class="w-100 justify-content-between rounded-3 h-100"
              >
                <SprintTaskStats
                  @click="openTabAboutTask(task)"
                  :task="task"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="sprint-info-modal__stats w-100 d-flex flex-column">
          <div class="px-3 w-100 border-bottom">
            <ul class="nav nav-underline">
              <div
                @click="switchToTabAboutSprint"
                :class="getNavLinkStyle(isTabAboutSprint)"
              >
                Cтатистика спринта
              </div>
              <div :class="getNavLinkStyle(isTabAboutTask)">Cтатистика задачи</div>
            </ul>
          </div>

          <SprintStatsPage
            :is-opened="isTabAboutSprint"
            v-if="isTabAboutSprint"
            :project="project"
            :sprint="sprint"
          />
          <SprintTaskStatsPage
            :is-opened="isTabAboutTask"
            v-if="isTabAboutTask"
            :task="(currentTask as Task)"
            :user="(user as User)"
          />
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.sprint-info-modal {
  width: 65%;
  height: fit-content;
  max-height: 80%;
  @include flexible(column, $align-self: center, $justify-self: center);

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }

  &__stats {
    @include flexible(flex-start);
    width: 100%;
    max-height: 100%;
  }

  &__tasks {
    height: fit-content;
    max-height: 600px;
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  @include flexible(center, flex-start);
}

.modal-layout-enter-from .finish-project-modal,
.modal-layout-leave-to .finish-project-modal {
  transform: scale(0.9);
}
</style>
