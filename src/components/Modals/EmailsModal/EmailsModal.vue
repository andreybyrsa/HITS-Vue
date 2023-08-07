<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import {
  EmailsModalProps,
  EmailsModalEmits,
} from '@Components/Modals/EmailsModal/EmailsModal.types'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

defineProps<EmailsModalProps>()

const emit = defineEmits<EmailsModalEmits>()
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div
      v-if="isOpened"
      class="emails-modal p-3 rounded-3"
    >
      <Typography class-name="fs-4 text-primary w-100 text-center">
        Предварительный просмотр
      </Typography>

      <div class="emails-modal__content w-100 p-1">
        <template
          v-for="(email, index) in emails"
          :key="index"
        >
          <div class="emails-modal__input w-100">
            <div class="emails-modal__email w-100">
              <Input
                v-model="emails[index]"
                prepend="@"
              />
              <Button
                class-name="btn-close"
                @click="emit('remove-email', index)"
              ></Button>
            </div>
          </div>
        </template>
      </div>

      <Button
        class-name="btn-primary w-100"
        @click="emit('close-modal')"
      >
        Сохранить изменения
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.emails-modal {
  width: 400px;
  background-color: $white-color;

  overflow-y: scroll;

  @include flexible(
    $flex-direction: column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, flex-end);
  }

  &__content {
    max-height: 300px;

    overflow-y: scroll;

    @include flexible(center, flex-start, column, $gap: 8px);
  }

  &__email {
    @include flexible(center, flex-start, $gap: 8px);
  }
}

.modal-layout-enter-from .emails-modal,
.modal-layout-leave-to .emails-modal {
  transform: scale(0.9);
}
</style>
