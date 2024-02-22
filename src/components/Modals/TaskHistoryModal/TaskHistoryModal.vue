<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="task-history-modal p-3 rounded-3">
      <div class="task-history-modal__header w-100">
        <Typography class-name="fs-4 text-primary"> Подробности этапа </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>
    </div>
    <div>1</div>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue'

import {
  TaskHistoryModalProps,
  TaskHistoryModalEmits,
} from '@Components/Modals/TaskHistoryModal/TaskHistoryModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

const props = defineProps<TaskHistoryModalProps>()
const emit = defineEmits<TaskHistoryModalEmits>()
</script>

<style scoped lang="scss">
.task-history-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}
</style>
