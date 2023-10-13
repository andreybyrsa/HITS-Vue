<script setup lang="ts">
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  RequestsAndInvitationsEmits,
  RequestsAndInvitationsProps,
} from '@Components/Modals/TeamModal//RequestsAndInvitationsModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Table from '@Components/Table/Table.vue'

defineProps<RequestsAndInvitationsProps>()

const emits = defineEmits<RequestsAndInvitationsEmits>()

function closeTeamModal() {
  emits('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeTeamModal"
    ><div class="list-modal p-3">
      <div class="list-modal__header">
        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-backspace-fill"
          @click="closeTeamModal"
        >
          Назад
        </Button>

        <Typography
          class-name="p-3 w-100 bg-white rounded-3 fs-6 text-primary text-nowrap overflow-x-scroll"
        >
          Запросы и приглашения в команду {{ team.name }}
        </Typography>
      </div>
      <div class="list-modal__content bg-primary text-white"></div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.list-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    stretch,
    flex-start,
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__content {
    @include flexible(stretch, flex-start, $gap: 16px);
  }
}

.modal-layout-enter-from .list-modal,
.modal-layout-leave-to .list-modal {
  transform: translateX(100%);
}
</style>
