<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import {
  SprintChartModalProps,
  SprintChartModalEmits,
} from '@Components/Modals/SprintChartModal/SprintChartModal.types'
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

import BurndownChart from '../../Charts/BurndownChart/BurndownChart.vue'

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

const props = defineProps<SprintChartModalProps>()
const emit = defineEmits<SprintChartModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const tasks = storeToRefs(useTasksStore())
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="sprint-modal bg-white rounded p-3">
      <div class="d-flex align-items-center justify-content-between border-bottom">
        <Typography class-name="fs-3 text-primary text-center ">
          Спринт: "{{ sprint?.name }}"
        </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>
      <div class="d-flex gap-2 align-items-center">
        <div :class="getProjectStatusStyle(sprint.status)">
          {{ getProjectStatus().translatedStatus[sprint.status] }}
        </div>
        <Typography class-name="text-primary">Общие часы работы:</Typography>
        {{ sprint?.workingHours }} ч.
      </div>
      <ul class="list-group rounded-3">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="sprint?.id"
          >
            Цель спринта:
          </Button>
          <Collapse :id="sprint?.id">
            <div class="p-2">{{ sprint?.goal }}</div>
          </Collapse>
        </li>
      </ul>

      <div class="my-2 d-flex gap-2 w-100">
        <div class="w-100">
          <Typography class-name="text-primary">Начало спринта:</Typography>
          <Button class-name="border w-100">{{
            getFormattedDate(sprint?.startDate)
          }}</Button>
        </div>
        <div class="w-100">
          <Typography class-name="text-primary">Конец спринта:</Typography>
          <Button class-name="border w-100">{{
            getFormattedDate(sprint?.finishDate)
          }}</Button>
        </div>
      </div>
      <div>
        <Typography class-name="text-primary">Сгорающая диаграмма:</Typography>
      </div>
      <div>
        <BurndownChart :sprint="sprint" />
      </div>
    </div>
  </ModalLayout>
</template>
<style lang="scss" scoped>
.sprint-modal {
  width: 75ex;
  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
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
