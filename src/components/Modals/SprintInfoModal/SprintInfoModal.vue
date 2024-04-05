<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import {
  SprintInfoModalProps,
  SprintInfoModalEmits,
} from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'

import { ref } from 'vue'
import SprintStatsPage from '@Views/Project/SprintStatsPage.vue'
import SprintTasksStatsPage from '@Views/Project/SprintTasksStatsPage.vue'
import { Task } from '@Domain/Project'

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
    isTabAboutSprint.value = false
    isTabAboutTask.value = true
  }
}

function switchToTabAboutSprint() {
  isTabAboutSprint.value = true
  isTabAboutTask.value = false
}
function switchToTabAboutTask() {
  isTabAboutSprint.value = false
  isTabAboutTask.value = true
}

// const sprintById = ref<Sprint>()

// onBeforeMount(getSprintById)

// async function getSprintById() {
//   if (props.isSprinInfoModal) {
//     const currentUser = user.value
//     if (currentUser?.token) {
//       const { token } = currentUser
//       const sprintId = props.sprint?.id

//       const response = await SprintService.getSprintById(sprintId, token)

//       if (response instanceof Error) {
//         return useNotificationsStore().createSystemNotification(
//           'Система',
//           response.message,
//         )
//       }

//       sprintById.value = response
//     }
//   }
// }
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
        <div class="sprint-info-modal__tasks d-flex flex-column gap-2 h-100">
          <Typography class-name="fs-4 text-primary border-bottom w-75"
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
          <div class="overflow-y-auto w-100">
            <div
              v-for="(task, index) in props.sprint?.tasks"
              :key="index"
              class="w-100 p-1"
            >
              <Button
                variant="outline-secondary"
                class="w-100 justify-content-between rounded-3"
                @click="openTabAboutTask"
              >
                <div class="text-dark">{{ task.name }}</div>
              </Button>
            </div>
          </div>
        </div>

        <div class="sprint-info-modal__stats w-100 d-flex flex-column">
          <div class="px-3 w-100 border-bottom">
            <ul class="nav nav-underline">
              <div
                :class="getNavLinkStyle(isTabAboutSprint)"
                @click="switchToTabAboutSprint"
              >
                Общая статистика
              </div>
              <div :class="getNavLinkStyle(isTabAboutTask)">Статистика задачи</div>
            </ul>
          </div>

          <SprintStatsPage
            :is-opened="isTabAboutSprint"
            v-if="isTabAboutSprint"
            :project="project"
            :sprint="sprint"
          />
          <SprintTasksStatsPage
            :is-opened="isTabAboutTask"
            v-if="isTabAboutTask"
            :project="project"
            :task="(currentTask as Task)"
            :sprint="sprint"
          />
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.sprint-info-modal {
  width: 65%;
  height: 70%;
  max-height: 70%;
  @include flexible(
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );
  @include flexible(column, $align-self: center, $justify-self: center, $gap: 16px);

  transition: all $default-transition-settings;

  &__tasks {
    @include flexible(flex-start);
    width: 50%;
    height: 92%;
    max-height: 92%;
  }

  &__header {
    @include flexible(center, space-between);
  }

  &__stats {
    @include flexible(flex-start);
    width: 100%;
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
