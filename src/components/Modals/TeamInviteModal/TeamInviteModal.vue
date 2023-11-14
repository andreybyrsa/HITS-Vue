<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import {
  TeamInviteModalEmits,
  TeamInviteModalProps,
} from '@Components/Modals/TeamInviteModal/TeamInviteModal.types'
import Button from '@Components/Button/Button.vue'
import TeamInviteRegisteredUser from '@Components/Modals/TeamInviteModal/TeamInviteRegisteredUser.vue'
import TeamInviteUnregisteredUser from '@Components/Modals/TeamInviteModal/TeamInviteUnregisteredUser.vue'
import TeamAccessionsService from '@Services/TeamAccessionsService'

const props = defineProps<TeamInviteModalProps>()

const emit = defineEmits<TeamInviteModalEmits>()

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

const { enter } = useMagicKeys()

const isFromPortal = ref<boolean>(true)

watch(enter, () => {
  emit('close-modal')
})

const inviteRegisteredUsers = async (users: string[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamAccessionsService.inviteRegisteredUsers(
      users,
      props.team.id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

const inviteUnregisteredUsers = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamAccessionsService.inviteUnregisteredUsers(
      emails,
      props.team.id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

function closeModal() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeModal"
  >
    <div class="invite-modal p-3 rounded bg-white">
      <div class="invite-modal__switch-buttons">
        <Button
          :class-name="
            !isFromPortal ? 'rounded btn-light btn-sm' : 'rounded btn-link btn-sm'
          "
          v-model="isFromPortal"
          @click="() => (isFromPortal = true)"
          :disabled="isFromPortal"
        >
          Пригласить с портала сайта</Button
        >
        <Button
          :class-name="
            isFromPortal ? 'rounded btn-light btn-sm' : 'rounded btn-link btn-sm'
          "
          v-model="isFromPortal"
          @click="() => (isFromPortal = false)"
          :disabled="!isFromPortal"
        >
          Пригласить нового пользователя</Button
        >
      </div>

      <TeamInviteRegisteredUser
        v-if="isFromPortal"
        :name="name"
        @invite-registered-users="inviteRegisteredUsers"
      />
      <TeamInviteUnregisteredUser
        v-else
        @invite-unregistered-users="inviteUnregisteredUsers"
      />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.invite-modal {
  width: 600px;
  height: 450px;
  background-color: #e9e9e9;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

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
