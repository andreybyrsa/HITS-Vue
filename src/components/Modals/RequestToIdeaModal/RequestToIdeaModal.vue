<script lang="ts" setup>
import {
  RequestToIdeaModalProps,
  RequestToIdeaModalEmits,
} from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'
import RequestTeams from '@Domain/RequestTeams'
import Team from '@Domain/Team'

const requestTeams = defineModel<RequestTeams[]>('requestTeams', { required: true })
const teams = defineModel<Team[]>('teams', { required: true })

defineProps<RequestToIdeaModalProps>()
const emit = defineEmits<RequestToIdeaModalEmits>()

function closeModal() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    @on-outside-close="closeModal"
    :is-opened="isOpened"
  >
    <div class="request-idea-modal bg-white rounded">
      <div class="request-idea-modal-header">
        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-backspace-fill"
          @click="closeModal"
        >
          Назад
        </Button>

        <Typography
          class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap"
        >
          {{ idea?.name }}
        </Typography>
      </div>
      <RequestToIdeaForm
        v-model:teams="teams"
        :idea="idea"
        v-model:requestTeams="requestTeams"
      />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.request-idea-modal {
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

.modal-layout-enter-from .request-idea-modal,
.modal-layout-leave-to .request-idea-modal {
  transform: translateX(100%);
}
</style>
