<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import {
  TeamActionProps,
  modalNames,
} from '@Components/Modals/TeamModal/TeamAction.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import TeamRequestModal from '@Components/Modals/TeamRequestModal/TeamRequestModal.vue'
import TeamInviteModal from '@Components/Modals/TeamInviteModal/TeamInviteModal.vue'
import TeamLettersModal from '@Components/Modals/TeamLettersModal/TeamLettersModal.vue'
import TeamActionButtons from '@Components/Modals/TeamModal/TeamActionButtons.vue'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

import { TeamRequest } from '@Domain/TeamRequest'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { deleteTeam, invitePortalUsers, inviteOutsideUsers, sendRequest } =
  TeamService

defineProps<TeamActionProps>()
const router = useRouter()

const { deleteModal, inviteModal, requestModal, requestsAndInvitationsModal } =
  modalNames

const teamId = ref<number | null>(null)
const modalId = ref<string | null>(null)

const handleDeleteTeam = async () => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await deleteTeam(teamId.value, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
    closeModal()
    router.push('/teams/list')
  }
}
const handleInviteFromPortal = async (users: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await invitePortalUsers({ emails: users }, teamId.value, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
  }
  closeModal()
}

const handleInviteFromOutside = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await inviteOutsideUsers(
      teamId.value,
      { emails: emails },
      token,
    )
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
  }
  closeModal()
}

const handleSendRequestToTheTeam = async (teamRequest: TeamRequest) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await sendRequest(teamId.value, teamRequest, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
    closeModal()
  }
}

function openModal(id: number, modal: string) {
  teamId.value = id
  modalId.value = modal
}

function closeModal() {
  modalId.value = null
}
</script>
<template>
  <div
    class="team-action"
    v-if="team && user"
  >
    <TeamActionButtons
      :team="team"
      @open-modal="openModal"
    />

    <DeleteModal
      v-if="user?.email == team.owner.email"
      :is-opened="modalId == deleteModal"
      @close-modal="closeModal"
      @delete="handleDeleteTeam"
    />
    <TeamInviteModal
      :display-by="['firstName', 'lastName']"
      :email="'email'"
      name="teamMembers"
      :is-opened="modalId == inviteModal"
      @close-modal="closeModal"
      @invite-registered-users="handleInviteFromPortal"
      @invite-unregistered-users="handleInviteFromOutside"
    />
    <template v-if="user?.email != team.owner.email">
      <TeamRequestModal
        mode="write"
        :type="
          team.members.find((member) => member.email == user?.email)
            ? 'leave'
            : 'enter'
        "
        :sender="user"
        :is-opened="modalId == requestModal"
        @close-modal="closeModal"
        @request="handleSendRequestToTheTeam"
      />
    </template>
    <TeamLettersModal
      :is-opened="modalId == requestsAndInvitationsModal"
      :team="team"
      @close-modal="closeModal"
    />
  </div>
</template>
<style lang="scss" scoped>
.team-action {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
