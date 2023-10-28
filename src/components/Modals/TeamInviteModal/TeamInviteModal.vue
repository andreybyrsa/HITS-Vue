<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import {
  TeamInviteModalEmits,
  TeamInviteModalProps,
} from '@Components/Modals/TeamInviteModal/TeamInviteModal.types'
import Button from '@Components/Button/Button.vue'
import InviteUnregisteredUser from '@Components/Modals/InviteModal/InviteUnregisteredUser.vue'
import InviteRegisteredUser from '@Components/Modals/InviteModal/InviteRegisteredUser.vue'

defineProps<TeamInviteModalProps>()

const emit = defineEmits<TeamInviteModalEmits>()

const { enter } = useMagicKeys()

const isFromPortal = ref<boolean>(true)

watch(enter, () => {
  emit('close-modal')
})

const inviteRegisteredUsers = async (users: string[]) => {
  emit('inviteRegisteredUsers', users)
}

const inviteUnRegisteredUsers = async (emails: string[]) => {
  emit('inviteUnregisteredUsers', emails)
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invite-modal p-3 rounded bg-white">
      <div class="invite-modal__switch-buttons">
        <Button
          :class-name="
            isFromPortal ? 'rounded btn-light btn-sm' : 'rounded btn-link btn-sm'
          "
          v-model="isFromPortal"
          @click="() => (isFromPortal = true)"
          :disabled="isFromPortal"
        >
          Пригласить с портала сайта</Button
        >
        <Button
          :class-name="
            !isFromPortal ? 'rounded btn-light btn-sm' : 'rounded btn-link btn-sm'
          "
          v-model="isFromPortal"
          @click="() => (isFromPortal = false)"
          :disabled="!isFromPortal"
        >
          Пригласить нового пользователя</Button
        >
      </div>

      <InviteRegisteredUser
        v-if="isFromPortal"
        :name="name"
        @invite-registered-users="inviteRegisteredUsers"
      />
      <InviteUnregisteredUser
        v-else
        @invite-unregistered-users="inviteUnRegisteredUsers"
      />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.invite-modal {
  width: 35%;
  height: 48%;
  background-color: #e9e9e9;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  &__switch-buttons {
    @include flexible(stretch, center, $flex-wrap: wrap, $gap: 4px);
  }

  &__users {
    max-width: 400px;
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }

  &__delete-user {
    cursor: pointer;
  }
}
</style>
