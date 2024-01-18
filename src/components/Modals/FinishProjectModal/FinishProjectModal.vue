<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import FinishProjectModalProps from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'

defineProps<FinishProjectModalProps>()
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="d-flex finish-project-modal bg-white rounded p-3">
      <div
        class="d-flex gap-5 fs-2 w-100 justify-content-between text-secondary border-bottom border-2"
      >
        <Typography class-name="text-primary fs-3">Завершение проекта</Typography>
        <Button
          class-name="fs-4"
          variant="close"
        ></Button>
      </div>

      <div class="d-flex gap-3 text-primary w-100">
        <div>Средняя оценка</div>
        <div>Участник</div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">9.3</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div
            class="bg-warning bg-opacity-75 rounded border text-secondary m-1 px-1"
          >
            Тим-лидер
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">7.5</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div class="bg-primary bg-opacity-50 rounded border text-primary m-1 px-1">
            Участник
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">6.8</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div class="m-1 px-1 bg-primary bg-opacity-50 rounded border text-primary">
            Участник
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">8.1</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div class="m-1 px-1 bg-primary bg-opacity-50 rounded border text-primary">
            Участник
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">8.0</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div class="m-1 px-1 bg-primary bg-opacity-50 rounded border text-primary">
            Участник
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 w-100">
        <div class="number rounded border">7.9</div>
        <div
          class="member justify-content-between d-flex text-nowrap rounded border w-100"
        >
          Артем Иванов
          <div class="m-1 px-1 bg-primary bg-opacity-50 rounded border text-primary">
            Участник
          </div>
        </div>
      </div>

      <div class="w-100 h-50">
        <div class="text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="report-textarea rounded border w-100 text-secondary"
          >Отчет</Textarea
        >
      </div>

      <Button
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
    $gap: 8px
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
