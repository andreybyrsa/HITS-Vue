<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  SprintInfoModalProps,
  SprintInfoModalEmits,
} from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import SprintInfoPlaceholder from '@Components/Modals/SprintInfoModal/SprintInfoPlaceholder.vue'

import SprintInfoHeader from '@Components/Modals/SprintInfoModal/SprintInfoHeader.vue'
import SpintInfoTasks from '@Components/Modals/SprintInfoModal/SprintInfoTasks.vue'
import SprintInfoContent from '@Components/Modals/SprintInfoModal/SprintInfoContent.vue'

import useUserStore from '@Store/user/userStore'
import SprintService from '@Services/SprintService'

import { Sprint, SprintMarks, Task } from '@Domain/Project'

import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

const props = defineProps<SprintInfoModalProps>()
const emit = defineEmits<SprintInfoModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const sprint = ref<Sprint>()
const sprintMarks = ref<SprintMarks[]>()
const currentTask = ref<Task>()

watch(
  () => props.isOpened,
  async () => {
    const currentUser = user.value

    if (currentUser?.token) {
      const { token } = currentUser

      const sprintParallelRequests: RequestConfig[] = [
        {
          request: () => SprintService.getSprint(props.sprintId, token),
          refValue: sprint,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => SprintService.getMarkSprint(props.sprintId, token),
          refValue: sprintMarks,
          onErrorFunc: openErrorNotification,
        },
      ]

      await sendParallelRequests(sprintParallelRequests)

      currentTask.value = undefined
    }
  },
)
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    appear-on-render
    @on-outside-close="emit('close-modal')"
  >
    <div class="spint-info-modal bg-white rounded p-3">
      <div
        v-if="sprint"
        class="d-flex flex-column gap-2 w-100 h-100"
      >
        <SprintInfoHeader
          :sprint-name="sprint.name"
          @close-modal="emit('close-modal')"
        />

        <div class="spint-info-modal__content w-100">
          <div class="h-100 w-25">
            <SpintInfoTasks
              :tasks="sprint.tasks"
              :members="project.members"
              v-model="currentTask"
            />
          </div>

          <div class="h-100 w-75">
            <SprintInfoContent
              v-if="sprintMarks"
              :task="currentTask"
              :sprint="sprint"
              :sprint-marks="sprintMarks"
            />
          </div>
        </div>
      </div>

      <SprintInfoPlaceholder v-else />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.spint-info-modal {
  width: 85%;
  height: 85dvh;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 8px
  );

  transition: all $default-transition-settings;

  &__content {
    @include flexible(flex-start, space-between, $gap: 16px);
    flex-grow: 1;
    height: 0;
  }
}

.modal-layout-enter-from .spint-info-modal,
.modal-layout-leave-to .spint-info-modal {
  transform: scale(0.9);
}
</style>
