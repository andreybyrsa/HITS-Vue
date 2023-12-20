<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  ConfirmModalEmits,
  ConfirmModalProps,
} from '@Components/Modals/ConfirmModal/ConfirmModal.types'

defineProps<ConfirmModalProps>()

const emit = defineEmits<ConfirmModalEmits>()

const isLoading = ref(false)

const { enter } = useMagicKeys()

watch(enter, () => {
  emit('close-modal')
})

function clickAction() {
  emit('action')
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="confirm-modal p-3 rounded bg-white">
      <div class="confirm-modal__header">
        <Typography class-name="text-center text-danger">
          {{ textQuestion + '*' }}
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <Button
        variant="light"
        :isLoading="isLoading"
        @click="clickAction"
      >
        {{ textButton }}
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.confirm-modal {
  max-width: 450px;

  @include flexible(
    stretch,
    stretch,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  &__header {
    @include flexible(flex-start, space-between, $gap: 16px);
  }
}
</style>
