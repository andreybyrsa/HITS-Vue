<script lang="ts" setup>
import {
  RequestToIdeaModalProps,
  RequestToIdeaModalEmits,
} from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

defineProps<RequestToIdeaModalProps>()
const emit = defineEmits<RequestToIdeaModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="idea"
      class="request-to-idea-modal bg-white rounded"
    >
      <div class="d-flex flex-column w-100">
        <div class="d-flex w-100 gap-2 p-2">
          <Button
            variant="primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="emit('close-modal')"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 border bg-white rounded-3 fs-4 text-primary text-nowrap"
          >
            {{ idea.name }}
          </Typography>
        </div>

        <RequestToIdeaForm :idea="idea" />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.request-to-idea-modal {
  position: relative;

  width: 50%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  overflow-y: scroll;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &-header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }
}

.modal-layout-enter-from .request-to-idea-modal,
.modal-layout-leave-to .request-to-idea-modal {
  transform: translateX(100%);
}
</style>
