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
import TeamAccessionsModal from '../TeamAccessionsModal/TeamAccessionsModal..vue'
import TeamActionButtons from '@Components/Modals/TeamModal/TeamActionButtons.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import TeamService from '@Services/TeamService'

import { TeamAccession } from '@Domain/TeamAccession'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

defineProps<TeamActionProps>()
const router = useRouter()

const { deleteModal, inviteModal, requestModal, teamAccessionsModal } = modalNames

const teamId = ref<number | null>(null)
const modalName = ref<string | null>(null)

const handleDeleteTeam = async () => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await TeamService.deleteTeam(teamId.value, token)
    console.log(response)
    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    router.push('/teams/list')
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}
const handleInviteFromPortal = async (users: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await TeamService.inviteRegisteredUsers(
      users,
      teamId.value,
      token,
    )
    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

const handleInviteFromOutside = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await TeamService.inviteUnregisteredUsers(
      emails,
      teamId.value,
      token,
    )
    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

const handleSendRequestToTheTeam = async (teamRequest: TeamAccession) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await TeamService.sendRequest(teamId.value, teamRequest, token)
    console.log(response)
    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
    return notificationsStore.createSystemNotification('Система', response.success)
  }
}

function openModal(id: number, modal: string) {
  teamId.value = id
  modalName.value = modal
}

function closeModal() {
  modalName.value = null
}
</script>
<template>
  <div
    class="team-action"
    v-if="team && user"
  >
    <TeamActionButtons
      :team="team"
      v-model="modalName"
      @open-modal="openModal"
    />

    <DeleteModal
      v-if="user?.email == team.owner.email"
      :is-opened="modalName === deleteModal"
      @close-modal="closeModal"
      @delete="handleDeleteTeam"
    />
    <TeamInviteModal
      :team="team"
      name="teamMembers"
      :is-opened="modalName === inviteModal"
      @close-modal="closeModal"
      @invite-registered-users="handleInviteFromPortal"
      @invite-unregistered-users="handleInviteFromOutside"
    />

    <TeamRequestModal
      mode="write"
      :type="
        team.members.find((member) => member.email == user?.email)
          ? 'LEAVE'
          : 'ENTER'
      "
      :sender="user"
      :is-opened="modalName === requestModal"
      @close-modal="closeModal"
      @send-request="handleSendRequestToTheTeam"
    />

    <TeamAccessionsModal
      :is-opened="modalName == teamAccessionsModal"
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
