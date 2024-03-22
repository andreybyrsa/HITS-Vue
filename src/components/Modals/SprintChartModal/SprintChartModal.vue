<script lang="ts" setup>
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

import SprintForm from '@Components/Forms/SprintForm/SprintForm.vue'

// import useUserStore from '@Store/user/userStore'
// import useTasksStore from '@Store/tasks/tasksStore'
// import SprintsListPage from '@Views/Project/SprintsListPage.vue'

// import BurndownChart from '../../Charts/BurndownChart/BurndownChart.vue'

// function getFormattedDate(date: string) {
//   if (date) {
//     const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
//     return formattedDate.value
//   } else {
//     return 'Реализуется'
//   }
// }

// onMounted(async () => {
//   await passTasks.value = props.sprint.tasks.filter(
//     (task) => task.status === 'Done',
//   ).length
//   allTasks.value = props.sprint.tasks.length
// })

const props = defineProps<SprintChartModalProps>()
const emit = defineEmits<SprintChartModalEmits>()

function close() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="sprint-modal bg-white rounded px-4 py-3">
      <SprintForm
        @close-modal="close"
        :sprint="sprint"
        :project="project"
      />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.sprint-modal {
  width: 85%;
  height: min-content;
  max-height: 80%;
  @include flexible(
    stretch,
    flex-start,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .sprint-modal,
.modal-layout-leave-to .sprint-modal {
  transform: scale(0.9);
}
</style>
<!-- @Components/Modals/SprintChartModal/SprintChartModal.types -->
