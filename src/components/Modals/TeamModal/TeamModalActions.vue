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

import { RequestToTeam, TeamMember } from '@Domain/Team'

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
const invitatinUsers = useInvitationUsersStore()

const { requests } = storeToRefs(requestsToTeamStore)
const { invitationUsers } = storeToRefs(invitatinUsers)

const isOpenedDeletingModal = ref(false)
const isOpenedLeavingModal = ref(false)
const isOpenedInvitationModal = ref(false)

const invitationUsersInTeam = ref<TeamMember[]>([])

function getAccessToEdit() {
  if (user.value) {
    const { id, role } = user.value
    const { owner } = props.team

    return role === 'ADMIN' || (id === owner.id && role === 'TEAM_OWNER')
  }
}

function getAccessToDelete() {
  if (user.value) {
    const { id, role } = user.value
    const { owner, members } = props.team

    return (
      role === 'ADMIN' ||
      (id === owner.id && members.length === 1 && role === 'TEAM_OWNER')
    )
  }
}

function getAccessToInvite() {
  if (user.value) {
    const { id, role } = user.value
    const { owner } = props.team

    return role === 'ADMIN' || (id === owner.id && role === 'TEAM_OWNER')
  }
}

function getAccessToInviteProject() {
  if (user.value) {
    const { id, role } = user.value
    const { owner, members } = props.team

    const isNotActive = members.find((user) => user.projectStatus === 'NOTACTIVE')

    return (
      (role === 'ADMIN' || (id === owner.id && role === 'TEAM_OWNER')) && isNotActive
    )
  }
}

function getAccessRequestToTeam() {
  if (user.value) {
    const { id, role } = user.value
    const { isRefused, owner, leader, members, closed } = props.team

    const isExistInMembers =
      members.find((user) => user.id === id) || owner.id === id || leader?.id === id
    const isExistNewRequest = requests.value.find(
      ({ userId, status }) => userId === id && status === 'NEW',
    )
    const isExistCanceledRequest = requests.value.find(
      ({ userId, status }) => userId === id && status === 'CANCELED',
    )

    const isExistNewInvitation = invitationUsers.value.find(
      ({ userId, status }) => userId === id && status === 'NEW',
    )

    return (
      !isRefused &&
      !closed &&
      !isExistInMembers &&
      !isExistNewRequest &&
      !isExistCanceledRequest &&
      !isExistNewInvitation &&
      (role === 'ADMIN' || role === 'MEMBER')
    )
  }
}

function getAccessWithdrawRequestToTeam() {
  if (user.value) {
    const { id } = user.value

    return requests.value.find(
      ({ userId, status }) => userId === id && status === 'NEW',
    )
  }
}

function getAccessCancelOrAcceptInvitationToTeam() {
  if (user.value) {
    const { id } = user.value
    const { owner, leader, members } = props.team

    const isExistInMembers =
      members.find((user) => user.id === id) || owner.id === id || leader?.id === id

    return (
      !isExistInMembers &&
      invitationUsers.value.find(
        ({ userId, status }) => userId === id && status === 'NEW',
      )
    )
  }
}

function getAccessToLeave() {
  if (user.value) {
    const { id: userId } = user.value
    const { owner, leader, members } = props.team

    return (
      userId !== owner.id &&
      leader?.id !== userId &&
      members.find((user) => user.id === userId)
    )
  }
}

function getAccess() {
  return (
    getAccessToEdit() ||
    getAccessToDelete() ||
    getAccessToInvite() ||
    getAccessRequestToTeam() ||
    getAccessWithdrawRequestToTeam() ||
    getAccessToLeave() ||
    getAccessCancelOrAcceptInvitationToTeam()
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

function openLeavingModal() {
  isOpenedLeavingModal.value = true
}
function closeLeavingModal() {
  isOpenedLeavingModal.value = false
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

async function handleLeaveTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id: userId } = currentUser
    const { id } = props.team

    await teamsStore.leaveFromTeam(id, userId, token)
  }
}

async function sendRequestInTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id: userId, email, firstName, lastName } = currentUser
    const { id: teamId } = props.team

    const requestToTeam = {
      teamId,
      userId,
      status: 'NEW',
      email,
      firstName,
      lastName,
    } as RequestToTeam

    await requestsToTeamStore.sendRequestInTeam(requestToTeam, token)
  }
}

async function withdrawRequestToTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id } = currentUser

    const currentRequest = requests.value.find(
      ({ userId, status }) => userId === id && status === 'NEW',
    )

    if (currentRequest) {
      await requestsToTeamStore.updateRequestToTeamStatus(
        currentRequest,
        'WITHDRAWN',
        token,
      )
    }
  }
}

async function acceptInvitationToTeam() {
  const currentUser = user.value
  const currentUserInvitation = invitationUsers.value?.find(
    ({ userId, status }) => userId === currentUser?.id && status === 'NEW',
  )

  if (currentUser?.token && currentUserInvitation) {
    const { token } = currentUser

    await invitatinUsers.updateInvitationStatus(
      currentUserInvitation,
      'ACCEPTED',
      token,
    )
  }
}

async function cancelInvitationToTeam() {
  const currentUser = user.value
  const currentUserInvitation = invitationUsers.value?.find(
    ({ userId, status }) => userId === currentUser?.id && status === 'NEW',
  )

  if (currentUser?.token && currentUserInvitation) {
    const { token } = currentUser

    await invitatinUsers.updateInvitationStatus(
      currentUserInvitation,
      'CANCELED',
      token,
    )
  }
}

const isOpenedConfirmModalAccepted = ref(false)
const isOpenedConfirmModalCancel = ref(false)
const isOpenedConfirmModalCancelRequest = ref(false)

function openConfirmModalCancelRequest() {
  isOpenedConfirmModalCancelRequest.value = true
}

function openConfirmModalAccepted() {
  isOpenedConfirmModalAccepted.value = true
}

function openConfirmModalCancel() {
  isOpenedConfirmModalCancel.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModalAccepted.value = false
  isOpenedConfirmModalCancel.value = false
  isOpenedConfirmModalCancelRequest.value = false
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
      v-if="getAccessToInviteProject()"
      variant="success"
      @click="openInvitationModal"
    >
      Добавить пользователя в проект
    </Button>

    <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openLeavingModal"
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
      v-if="getAccessWithdrawRequestToTeam()"
      variant="danger"
      @click="openConfirmModalCancelRequest"
    >
      Отозвать заявку
    </Button>

    <Button
      v-if="getAccessCancelOrAcceptInvitationToTeam()"
      variant="success"
      @click="openConfirmModalAccepted"
    >
      Принять приглашение
    </Button>

    <Button
      v-if="getAccessCancelOrAcceptInvitationToTeam()"
      variant="danger"
      @click="openConfirmModalCancel"
    >
      Отклонить приглашение
    </Button>

    <DeleteModal
      :is-opened="isOpenedDeletingModal"
      :item-name="team.name"
      @delete="handleDeleteTeam"
      @close-modal="closeDeletingModal"
    />

    <InvitationTeamMemberModal
      v-model="invitationUsersInTeam"
      :is-opened="isOpenedInvitationModal"
      @close-modal="closeInvitationModal"
    />

    <ConfirmModal
      :is-opened="isOpenedConfirmModalCancelRequest"
      text-button="Отозвать заявку"
      text-question="Вы действительно хотите отозвать заявку?"
      @close-modal="closeConfirmModal"
      @action="withdrawRequestToTeam"
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

    <ConfirmModal
      :is-opened="isOpenedLeavingModal"
      text-button="Выйти из команды"
      text-question="Вы действительно хотите выйти из команды?"
      @close-modal="closeLeavingModal"
      @action="handleLeaveTeam"
    />
  </div>
</template>
