<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import FinishProjectModalProps from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'

import { FinishProjectModalEmits } from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'
import { ref } from 'vue'
const props = defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const members = [
  {
    score: 9.3,
    name: 'Артем Иванов',
    role: 'Тим-лидер',
  },
  {
    score: 7.5,
    name: 'Артем Иванов',
    role: 'Участник',
  },
  {
    score: 6.8,
    name: 'Артем Иванов',
    role: 'Участник',
  },
  {
    score: 8.1,
    name: 'Артем Иванов',
    role: 'Участник',
  },
  {
    score: 8.0,
    name: 'Артем Иванов',
    role: 'Участник',
  },
  {
    score: 7.9,
    name: 'Артем Иванов',
    role: 'Участник',
  },
]
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="d-flex finish-project-modal bg-white rounded p-3">
      <div
        class="d-flex gap-5 fs-2 w-100 justify-content-between text-secondary border-bottom border-2"
      >
        <Typography class-name="text-primary fs-3">Завершение проекта</Typography>
        <Button
          @click="emit('close-modal')"
          class-name="fs-4"
          variant="close"
        ></Button>
      </div>

      <div class="d-flex w-100 gap-2 flex-column">
        <div class="d-flex gap-3 text-primary w-100">
          <div>Средняя оценка</div>
          <div>Участник</div>
        </div>
        <div
          class="d-flex gap-3 w-100"
          v-for="(member, index) in members"
          :key="index"
        >
          <div class="ps-1 number rounded border">{{ member.score }}</div>
          <div
            class="ps-1 member justify-content-between d-flex text-nowrap rounded border w-100"
          >
            {{ member.name }}
            <div
              v-if="member.role === 'Тим-лидер'"
              :class="`bg-warning bg-opacity-50 rounded border text-secondary m-1 px-1`"
            >
              {{ member.role }}
            </div>

            <div
              v-else
              :class="`bg-primary bg-opacity-50 rounded border text-primary m-1 px-1`"
            >
              {{ member.role }}
            </div>
          </div>
        </div>
      </div>

      <div class="w-100 h-50">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="report-textarea rounded border w-100"
          placeholder="Отчет"
          >Отчет</Textarea
        >
      </div>

      <Button
        @click="emit('close-modal')"
        class-name="mt-auto"
        variant="primary"
        >Закрыть проект
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.finish-project-modal {
  width: 600px;
  height: fit-content;
  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .finish-project-modal,
.modal-layout-leave-to .finish-project-modal {
  transform: scale(0.9);
}

.report-textarea {
  resize: none;
  height: 200px;
}

.number {
  width: 150px;
  @include flexible(center, start);
}

.member {
  @include flexible(center, start);
}
</style>
