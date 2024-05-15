<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import {
  BurndownModalProps,
  BurndownModalEmits,
} from '@Components/Modals/BurndownModal/BurndownModal.types'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Burndown from '@Components/Burndown/Burndown.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

defineProps<BurndownModalProps>()
const emit = defineEmits<BurndownModalEmits>()

function getFormattedFullDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="burndown-modal rounded bg-white px-3 py-2">
      <div class="burndown-modal__header w-100">
        <div
          class="burndown-modal__header-name fs-4 border-bottom text-primary w-100"
        >
          Спринт: "{{ sprint.name }}"
        </div>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div>
        <Typography class-name="text-primary"> Общие часы работы: </Typography>
        {{ sprint.workingHours }}ч
      </div>

      <div
        v-if="sprint.goal"
        class="w-100"
      >
        <ul class="list-group rounded-3">
          <li class="list-group-item p-0 overflow-hidden">
            <Button
              variant="light"
              class-name="collapse-controller w-100"
              v-collapse:openOnMount="sprint.id"
            >
              Цель
            </Button>
            <Collapse :id="sprint.id">
              <div class="p-2">{{ sprint.goal }}</div>
            </Collapse>
          </li>
        </ul>
      </div>

      <div class="d-flex gap-2 w-100">
        <div class="w-50">
          <Typography class-name="text-primary">Начало спринта*</Typography>
          <div class="px-2 py-1 rounded border w-100">
            {{ getFormattedFullDate(sprint.startDate) }}
          </div>
        </div>

        <div class="w-50">
          <Typography class-name="text-primary">Конец спринта*</Typography>
          <div class="px-2 py-1 rounded border w-100">
            {{ getFormattedFullDate(sprint.finishDate) }}
          </div>
        </div>
      </div>

      <div class="w-100 text-primary">
        Диаграмма сгорания*
        <Burndown :sprint="sprint" />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.burndown-modal {
  width: 600px;

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

    &-name {
      @include textEllipsis(1);
    }
  }
}

.modal-layout-enter-from .burndown-modal,
.modal-layout-leave-to .burndown-modal {
  transform: scale(0.9);
}
</style>
