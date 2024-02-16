<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import {
  SprintModalProps,
  SprintModalEmits,
} from '@Components/Modals/SprintModal/SprintModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ProgressBar from '@Components/ProgressBar/ProgressBar.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { getProjectStatus, getProjectStatusStyle } from '@Utils/getProjectStatus'

import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'
import SprintsListPage from '@Views/Project/SprintsListPage.vue'

import BurndownChart from './BurndownChart.vue'
import SprintForm from '@Components/Forms/SprintForm/SprintForm.vue'

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

const props = defineProps<SprintModalProps>()
const emit = defineEmits<SprintModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const tasks = storeToRefs(useTasksStore())
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="sprint-modal"
  >
    <div class="sprint-modal bg-white rounded p-3">
      <SprintForm />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.sprint-modal {
  width: 90%;
  height: 900px;
  @include flexible(
    stretch,
    flex-start,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}
.left-block {
  display: flex;
  flex-direction: column;
}

.tasks {
  display: flex;
  justify-content: space-between;
}

.modal-layout-enter-from .sprint-modal,
.modal-layout-leave-to .sprint-modal {
  transform: scale(0.9);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
.border-b {
  border-bottom-width: 4px;
}
</style>
