<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import {
  InviteModalProps,
  inviteModalEmits,
} from '@Components/Modals/InviteTeamToIdeaModal/InviteTeamToIdeaModal.types'

const props = defineProps<InviteModalProps>()

const emit = defineEmits<inviteModalEmits>()

const isLoading = ref<boolean>(false)

const { enter } = useMagicKeys()

const text = computed(() => {
  const { ideaName, teamName } = props
  const initialText =
    props.type === 'INVITE'
      ? `Вы действительно хотите пригласить ${teamName} в`
      : `Вы действительно хотите отозвать приглашение ${teamName} в`

  if (ideaName) {
    return `${initialText} "${ideaName}"?`
  }
  return initialText + '?'
})

watch(enter, () => {
  emit('close-modal')
})

async function handleOnClick() {
  isLoading.value = true
  emit('on-click')
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
        {{ text }}
      </Typography>
      <Button
        v-if="props.type === 'INVITE'"
        variant="primary"
        :isLoading="isLoading"
        @click="handleOnClick"
      >
        Пригласить
      </Button>
      <Button
        v-else
        variant="danger"
        :isLoading="isLoading"
        @click="handleOnClick"
      >
        Отозвать приглашение
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.delete-modal {
  max-width: 450px;

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
