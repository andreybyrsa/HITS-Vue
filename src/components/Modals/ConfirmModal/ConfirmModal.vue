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
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="confirm-modal p-3 rounded bg-white">
      <Typography class-name="text-center text-danger">
        {{ textQuestion + '*' }}
      </Typography>
      <Button
        variant="primary"
        :isLoading="isLoading"
        @click="emit('action')"
      >
        {{ textButton }}
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.confirm-modal {
  @include flexible(
    stretch,
    stretch,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );
}
</style>
