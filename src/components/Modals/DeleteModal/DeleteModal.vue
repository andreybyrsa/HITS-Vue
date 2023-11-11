<script lang="ts" setup>
import { ref, watch } from 'vue'
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

const isLoading = ref<boolean>(false)

const { enter } = useMagicKeys()

watch(enter, () => {
  emit('close-modal')
})

async function handleDelete() {
  isLoading.value = true
  emit('delete')
  isLoading.value = false
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
        variant="danger"
        :isLoading="isLoading"
        @click="handleDelete"
      >
        Удалить
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.delete-modal {
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
