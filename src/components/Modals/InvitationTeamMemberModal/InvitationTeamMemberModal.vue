<script lang="ts" setup>
import {
  InvitationTeamMemberModalEmits,
  InvitationTeamMemberModalProps,
} from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TeamInviteForm from '@Components/Forms/TeamInviteForm/TeamInviteForm.vue'

defineProps<InvitationTeamMemberModalProps>()
const emit = defineEmits<InvitationTeamMemberModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invitation-modal bg-white rounded">
      <TeamInviteForm />
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.invitation-modal {
  width: 400px;
}
</style>
