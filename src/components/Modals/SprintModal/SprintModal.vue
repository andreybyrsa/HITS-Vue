<script lang="ts" setup>
import {
  SprintModalProps,
  SprintModalEmits,
} from '@Components/Modals/SprintModal/SprintModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import SprintForm from '@Components/Forms/SprintForm/SprintForm.vue'

defineProps<SprintModalProps>()
const emit = defineEmits<SprintModalEmits>()

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
