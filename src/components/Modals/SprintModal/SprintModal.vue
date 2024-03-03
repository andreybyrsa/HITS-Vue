<script lang="ts" setup>
import {
  SprintModalProps,
  SprintModalEmits,
} from '@Components/Modals/SprintModal/SprintModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import SprintForm from '@Components/Forms/SprintForm/SprintForm.vue'

const props = defineProps<SprintModalProps>()
const emit = defineEmits<SprintModalEmits>()

function close() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="sprint-modal"
  >
    <div class="sprint-modal bg-white rounded p-3">
      <SprintForm @close-modal="close" />
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
