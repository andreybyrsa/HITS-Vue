<script lang="ts" setup>
import {
  InvitationTeamMemberModalEmits,
  InvitationTeamMemberModalProps,
} from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TeamInviteForm from '@Components/Forms/TeamInviteForm/TeamInviteForm.vue'
import Button from '@Components/Button/Button.vue'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { User } from '@Domain/User'
import { ref } from 'vue'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'

defineProps<InvitationTeamMemberModalProps>()
const emit = defineEmits<InvitationTeamMemberModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const invitationUsers = ref<User[]>([])
const isLoading = ref(false)

const inviteUsers = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    isLoading.value = true

    await useInvitationUsersStore().inviteUsers(
      invitationUsers.value,
      route.params.teamId.toString(),
      token,
    )

    invitationUsers.value = []
    isLoading.value = false
    emit('close-modal')
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invitation-modal p-3 bg-white rounded">
      <TeamInviteForm v-model="invitationUsers" />
      <Button
        :isLoading="isLoading"
        variant="primary"
        @click="inviteUsers"
        >Пригласить</Button
      >
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.invitation-modal {
  width: 1000px;
  height: 600px;
  overflow-y: scroll;
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
