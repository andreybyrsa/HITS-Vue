<script lang="ts" setup>
import {
  LetterModalProps,
  LetterModalEmits,
} from '@Components/Modals/LetterModal/LetterModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

defineProps<LetterModalProps>()
const emit = defineEmits<LetterModalEmits>()

function closeModal() {
  emit('close-modal')
}

function acceptRequest() {
  emit('accept-request')
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeModal"
  >
    <div class="letter-modal bg-white rounded p-3">
      <div class="d-flex justify-content-space-between align-items-center w-100">
        <Typography class-name="fs-5 text-primary w-100">
          Мотивационное письмо
        </Typography>
        <Button
          variant="close"
          @click="closeModal"
        />
      </div>

      <Typography class-name="p-2 border rounded w-100">
        {{ letter }}
      </Typography>

      <Button
        v-if="$route.name === 'market-idea-modal'"
        class-name="btn-success"
        @click="acceptRequest"
      >
        Принять заявку
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.letter-modal {
  width: 400px;

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

.modal-layout-enter-from .letter-modal,
.modal-layout-leave-to .letter-modal {
  transform: scale(0.9);
}
</style>
