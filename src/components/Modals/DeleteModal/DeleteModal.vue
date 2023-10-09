<script lang="ts" setup>
import { watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  DeleteModalEmits,
  DeleteModalProps,
} from '@Components/Modals/DeleteModal/DeleteModal.types'

defineProps<DeleteModalProps>()

const emit = defineEmits<DeleteModalEmits>()

const { enter } = useMagicKeys()

watch(enter, () => {
  emit('close-modal')
})

async function handleDelete() {
  emit('delete')
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="delete-modal p-3 rounded bg-white">
      <Typography class-name="text-center">
        Вы действительно хотите удалить?
      </Typography>
      <Button
        @click="handleDelete"
        class-name="btn-danger w-100"
      >
        Удалить
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.delete-modal {
  @include flexible(
    center,
    flex-end,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );
}
</style>
