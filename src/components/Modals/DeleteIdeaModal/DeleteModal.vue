<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  DeleteModalEmits,
  DeleteModalProps,
} from '@Components/Modals/DeleteIdeaModal/DeleteModal.types'

import useUserStore from '@Store/user/userStore'

import IdeasService from '@Services/IdeasService'

const props = defineProps<DeleteModalProps>()

const emit = defineEmits<DeleteModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

async function handleDeleteIdea() {
  await IdeasService.deleteInitiatorIdea(props.ideaId, user.value?.token as string)
  emit('close-modal')
  window.location.reload()
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="delete-modal p-3 rounded bg-white">
      <Typography class-name="text-center"
        >Вы действительно хотите удалить?</Typography
      >
      <Button
        @click="handleDeleteIdea"
        class-name="btn-danger w-100"
        >Удалить идею
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
