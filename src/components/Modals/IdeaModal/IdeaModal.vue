<script lang="ts" setup>
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @close-modal="emit('close-modal')"
  >
    <div class="idea-modal p-3 bg-white h-100">
      <Button
        class-name="idea-modal__close-button btn-primary rounded-end-0"
        prepend-icon-name="bi bi-x-lg"
        @click="emit('close-modal')"
      >
        Закрыть
      </Button>

      <Typography class-name="fs-3 text-primary">
        Создание реактивного двигателя для ракеты
      </Typography>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.idea-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;

  @include flexible(
    center,
    flex-start,
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__close-button {
    @include position(absolute, $top: 16px, $left: -135px);

    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
