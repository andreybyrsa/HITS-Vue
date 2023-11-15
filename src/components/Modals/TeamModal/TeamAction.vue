<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import {
  TeamActionProps,
  modalNames,
} from '@Components/Modals/TeamModal/TeamAction.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import TeamAccessionModal from '@Components/Modals/TeamAccessionModal/TeamAccessionModal.vue'
import TeamInviteModal from '@Components/Modals/TeamInviteModal/TeamInviteModal.vue'
import TeamAccessionsModal from '../TeamAccessionsModal/TeamAccessionsModal..vue'
import TeamActionButtons from '@Components/Modals/TeamModal/TeamActionButtons.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'

import InvitationService from '@Services/InvitationService'

import { TeamAccession } from '@Domain/TeamAccession'
import Success from '@Domain/ResponseMessage'

import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import TeamAccessionsService from '@Services/TeamAccessionsService'

const teamStore = useTeamStore()

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

defineProps<TeamActionProps>()
const router = useRouter()

const { deleteModal, inviteModal, accessionModal, teamAccessionsModal } = modalNames

const teamId = ref<string | null>(null)
const modalName = ref<string | null>(null)

const handleDeleteTeam = async () => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    await teamStore.deleteTeam(teamId.value, token)

    closeModal()
    router.go(-1)
  }
}
const handleInviteFromPortal = async (users: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser

    const response = await TeamAccessionsService.inviteRegisteredUsers(
      users,
      teamId.value,
      token,
    )
    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    closeModal()
  }
}

const handleInviteFromOutside = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const currentTeamId = teamId.value

    const teamParallelRequests = [
      () =>
        TeamAccessionsService.inviteRegisteredUsers(emails, currentTeamId, token),
      () => InvitationService.inviteUsers({ emails, roles: ['INITIATOR'] }, token),
    ]
    await makeParallelRequests<Error | Success>(teamParallelRequests).then(
      (responses) => {
        responses.forEach((response) => {
          if (response.id === 0) {
            checkResponseStatus(response)
          } else if (response.id === 1) {
            checkResponseStatus(response)
          }
        })
      },
    )
    closeModal()
  }
}

const handleSendRequestToTheTeam = async (teamRequest: TeamAccession) => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    const response = await TeamAccessionsService.sendRequest(
      teamRequest,
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

function openModal(id: string, modal: string) {
  teamId.value = id
  modalName.value = modal
}

function closeModal() {
  modalName.value = null
}

function checkResponseStatus<T>(data: RequestResult<T>) {
  if (data.status !== 'fulfilled') {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
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

    <TeamAccessionModal
      mode="write"
      :type="
        team.members.find((member) => member.userId === user?.id) ? 'LEAVE' : 'ENTER'
      "
      :sender="user"
      :is-opened="modalName === accessionModal"
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
