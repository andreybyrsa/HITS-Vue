<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import {
  InviteModalEmits,
  InviteModalProps,
} from '@Components/Modals/InviteModal/InviteModal.types'
import Validation from '@Utils/Validation'
import { useForm } from 'vee-validate'

defineProps<InviteModalProps>()

const emit = defineEmits<InviteModalEmits>()

const { enter } = useMagicKeys()

interface InvitationForm {
  email: string
}

const { handleSubmit } = useForm<InvitationForm>({
  validationSchema: {
    email: (value: string) => Validation.checkEmail(value) || 'Ошика',
  },
})

watch(enter, () => {
  emit('close-modal')
})
const email = ref<string>('')
const handleInvite = handleSubmit(() => {
  emit('invite', email.value)
  emit('close-modal')
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invite-modal p-3 rounded bg-white">
      <Input
        :name="'email'"
        placeholder="Введите почту"
        v-model="email"
      />
      <Button
        @click="handleInvite"
        class-name="btn-primary w-100"
        >Пригласить
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.invite-modal {
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
