<script lang="ts" setup>
import {
  InvitationTeamMemberModalEmits,
  InvitationTeamMemberModalProps,
} from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.types'
import UsersInviteTable from '@Components/Tables/UsersInviteTable/UsersInviteTable.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { User } from '@Domain/User'

const invitationUsers = defineModel<User[]>({ required: true })

defineProps<InvitationTeamMemberModalProps>()
const emit = defineEmits<InvitationTeamMemberModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invitation-modal p-3 bg-white overflow-y-scroll rounded">
      <UsersInviteTable v-model="invitationUsers" />
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.invitation-modal {
  width: 1000px;
  height: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .invitation-modal,
.modal-layout-leave-to .invitation-modal {
  transform: scale(0.9);
}
</style>
