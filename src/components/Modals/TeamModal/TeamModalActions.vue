<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import {
  TeamModalActionsProps,
  TeamModalActionsEmits,
} from '@Components/Modals/TeamModal/TeamModal.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import InvitationTeamMemberModal from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.vue'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import useRequestsToTeamStore from '@Store/requestsToTeam/requestsToTeamStore'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'

const props = defineProps<TeamModalActionsProps>()
const emit = defineEmits<TeamModalActionsEmits>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsStore = useTeamStore()
const requestsToTeamStore = useRequestsToTeamStore()
const { requests } = storeToRefs(requestsToTeamStore)
const invitatinUsers = useInvitationUsersStore()
const { invitationUsers } = storeToRefs(invitatinUsers)

const isOpenedDeletingModal = ref(false)
const isOpenedInvitationModal = ref(false)

function getAccessToEdit() {
  if (user.value) {
    const { id, role } = user.value
    const { owner, leader } = props.team

    return role === 'ADMIN' || id === owner.userId || id === leader?.userId
  }
}

function getAccessToDelete() {
  if (user.value) {
    const { id, role } = user.value
    const { owner } = props.team

    return role === 'ADMIN' || id === owner.userId
  }
}

function getAccessToInvite() {
  if (user.value) {
    const { id, role } = user.value
    const { owner, leader } = props.team

    return role === 'ADMIN' || id === owner.userId || id === leader?.userId
  }
}

function getAccessRequestToTeam() {
  if (user.value) {
    const { id } = user.value
    const { members, closed } = props.team

    return (
      !(
        members.find((user) => user?.userId === id) ||
        requests.value.find((request) => request.userId === id) ||
        invitationUsers.value?.find((invitation) => invitation.userId === id)
      ) && !closed
    )
  }
}

function getAccessCancelOrAcceptRequestToTeam() {
  if (user.value) {
    const { id } = user.value

    return invitationUsers.value?.find(
      (invitation) => invitation.userId === id && invitation.status === 'NEW',
    )
  }
}

function getAccessToLeave() {
  if (user.value) {
    const { id } = user.value
    const { owner, members } = props.team

    return id !== owner.userId && members.find((user) => user.userId === id)
  }
}

function getAccess() {
  return (
    getAccessToEdit() ||
    getAccessToDelete() ||
    getAccessToInvite() ||
    getAccessRequestToTeam() ||
    getAccessToLeave() ||
    getAccessCancelOrAcceptRequestToTeam() ||
    getAccessCancelOrAcceptRequestToTeam()
  )
}

function navigateToUpdateTeamForm() {
  router.push(`/teams/update/${props.team.id}`)
}

function openDeletingModal() {
  isOpenedDeletingModal.value = true
}

function closeDeletingModal() {
  isOpenedDeletingModal.value = false
}

function openInvitationModal() {
  isOpenedInvitationModal.value = true
}

function closeInvitationModal() {
  isOpenedInvitationModal.value = false
}

async function handleDeleteTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.team

    await teamsStore.deleteTeam(id, token).then(() => emit('close-modal'))
  }
}

async function sendRequestInTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.team

    await requestsToTeamStore.sendRequestInTeam(currentUser.id, id, token)
  }
}

async function acceptInvitationToTeam() {
  const currentUser = user.value
  const currentUserInvitation = invitationUsers.value?.find(
    (invitation) => invitation.userId === currentUser?.id,
  )

  if (currentUser?.token && currentUserInvitation) {
    const { token } = currentUser
    console.log(currentUserInvitation)

    await invitatinUsers.acceptInvitationToTeam(currentUserInvitation, token)
  }
}

async function cancelInvitationToTeam() {
  const currentUser = user.value
  const currentUserInvitation = invitationUsers.value?.find(
    (invitation) => invitation.userId === currentUser?.id,
  )

  if (currentUser?.token && currentUserInvitation) {
    const { token } = currentUser

    await invitatinUsers.cancelInvitationToTeam(currentUserInvitation, token)
  }
}

const isOpenedConfirmModalAccepted = ref(false)
const isOpenedConfirmModalCancel = ref(false)

function openConfirmModalAccepted() {
  isOpenedConfirmModalAccepted.value = true
}

function openConfirmModalCancel() {
  isOpenedConfirmModalCancel.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModalAccepted.value = false
  isOpenedConfirmModalCancel.value = false
}
</script>

<template>
  <div
    v-if="getAccess()"
    class="rounded-3 bg-white p-3 d-flex flex-wrap gap-3"
  >
    <Button
      v-if="getAccessToEdit()"
      variant="light"
      @click="navigateToUpdateTeamForm"
    >
      Редактировать
    </Button>

    <Button
      v-if="getAccessToDelete()"
      variant="danger"
      @click="openDeletingModal"
    >
      Удалить команду
    </Button>

    <Button
      v-if="getAccessToInvite()"
      variant="primary"
      @click="openInvitationModal"
    >
      Пригласить пользователя
    </Button>

    <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openDeletingModal"
    >
      Выйти из команды
    </Button>

    <Button
      v-if="getAccessRequestToTeam()"
      variant="primary"
      @click="sendRequestInTeam"
    >
      Подать заявку
    </Button>

    <Button
      v-if="getAccessCancelOrAcceptRequestToTeam()"
      variant="success"
      @click="openConfirmModalAccepted"
    >
      Принять приглашение
    </Button>

    <Button
      v-if="getAccessCancelOrAcceptRequestToTeam()"
      variant="danger"
      @click="openConfirmModalCancel"
    >
      Отклонить приглашение
    </Button>

    <DeleteModal
      :is-opened="isOpenedDeletingModal"
      @delete="handleDeleteTeam"
      @close-modal="closeDeletingModal"
    />

    <InvitationTeamMemberModal
      :is-opened="isOpenedInvitationModal"
      @close-modal="closeInvitationModal"
    />

    <ConfirmModal
      :is-opened="isOpenedConfirmModalAccepted"
      text-button="Принять заявку"
      text-question="Вы действительно хотите принять приглашение?"
      @close-modal="closeConfirmModal"
      @action="acceptInvitationToTeam"
    />

    <ConfirmModal
      :is-opened="isOpenedConfirmModalCancel"
      text-button="Отклонить заявку"
      text-question="Вы действительно хотите отклонить приглашение?"
      @close-modal="closeConfirmModal"
      @action="cancelInvitationToTeam"
    />
  </div>
</template>
