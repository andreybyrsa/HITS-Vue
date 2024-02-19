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

import { RequestToTeam, Team, TeamMember } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import useRequestsToTeamStore from '@Store/requestsToTeam/requestsToTeamStore'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'
import useInvitationsTeamToIdeaStore from '@Store/invitationTeamToIdea/invitationTeamToIdeaStore'
import { IdeaMarket } from '@Domain/IdeaMarket'
import { InvitationTeamToIdea } from '@Domain/InvitationTeamToIdea'

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

const invitationsTeamToIdeaStore = useInvitationsTeamToIdeaStore()
const { ideaInvitations } = storeToRefs(invitationsTeamToIdeaStore)

const isOpenedDeletingModal = ref(false)
const isOpenedLeavingModal = ref(false)
const isOpenedInvitationModal = ref(false)

const invitationUsersInTeam = ref<TeamMember[]>([])

const isOpenedConfirmModalCanceled = ref(false)
const isOpenedConfirmModalTeamNew = ref(false)

const currentTeam = ref<Team>()
const currentIdea = ref<IdeaMarket>()
const currentInvitation = ref<InvitationTeamToIdea>()

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

function getAccessToInviteInIdea() {
  return user.value?.role === 'INITIATOR' && !props.team.hasActiveProject
}

function getAccess() {
  return (
    getAccessToEdit() ||
    getAccessToDelete() ||
    getAccessToInvite() ||
    getAccessRequestToTeam() ||
    getAccessWithdrawRequestToTeam() ||
    getAccessToLeave() ||
    getAccessCancelOrAcceptInvitationToTeam() ||
    getAccessToInviteInIdea()
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

function getVariantButton(curretnIdeaId: string) {
  return ideaInvitations.value.find(
    ({ teamId, ideaId, status }) =>
      teamId === props.team.id && ideaId === curretnIdeaId && status === 'NEW',
  )
}

async function handleInviteTeam() {
  const currentUser = user.value

  if (currentUser?.token && currentTeam.value && currentIdea.value) {
    const { token, id: userId } = currentUser
    const { id, name: ideaName } = currentIdea.value
    const { id: teamId, name: teamName, membersCount, skills } = currentTeam.value

    const invitation: InvitationTeamToIdea = {
      id: '',
      ideaId: id,
      ideaName: ideaName,
      status: 'NEW',
      initiatorId: userId,
      teamId: teamId,
      teamName: teamName,
      teamMembersCount: membersCount,
      skills: skills,
    }

    await invitationsTeamToIdeaStore.postInvitationsToIdea(invitation, token)
  }
}

function openConfirmModalTeamNew(team: Team, idea: IdeaMarket) {
  currentTeam.value = team
  currentIdea.value = idea
  isOpenedConfirmModalTeamNew.value = true
}

function closeConfirmModalTeamNew() {
  isOpenedConfirmModalTeamNew.value = false
}

async function handleRevokeTeam() {
  const currentUser = user.value

  if (currentUser?.token && currentInvitation.value) {
    const { token } = currentUser
    const { id } = currentInvitation.value

    await invitationsTeamToIdeaStore.putInvitationForTeamToIdea(
      'WITHDRAWN',
      id,
      token,
    )
  }
}

function openConfirmModalTeamCanceled(invitation?: InvitationTeamToIdea) {
  currentInvitation.value = invitation
  isOpenedConfirmModalCanceled.value = true
}

function closeConfirmModalTeamCanceled() {
  isOpenedConfirmModalCanceled.value = false
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

    <div
      v-if="getAccessToInviteInIdea()"
      class="d-flex flex-wrap gap-3"
    >
      <div
        v-for="(invite, index) in props.ideasInitiator.filter(
          ({ status }) => status === 'RECRUITMENT_IS_OPEN',
        )"
        :key="index"
      >
        <Button
          :variant="getVariantButton(invite.id) ? 'danger' : 'success'"
          @click="
            getVariantButton(invite.id)
              ? openConfirmModalTeamCanceled(getVariantButton(invite.id))
              : openConfirmModalTeamNew(props.team, invite)
          "
        >
          {{ getVariantButton(invite.id) ? 'Отозвать из' : 'Пригласить в' }} "{{
            invite.name
          }}"
        </Button>
      </div>
    </div>

    <ConfirmModal
      :is-opened="isOpenedConfirmModalTeamNew"
      text-button="Пригласить команду"
      text-question="Вы действительно хотите пригласить команду?"
      @close-modal="closeConfirmModalTeamNew"
      @action="handleInviteTeam"
    />

    <ConfirmModal
      :is-opened="isOpenedConfirmModalCanceled"
      text-button="Отозвать команду"
      text-question="Вы действительно хотите отозвать команду?"
      @close-modal="closeConfirmModalTeamCanceled"
      @action="handleRevokeTeam"
    />

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
      text-question="Вы действительно хотите отозвать приглашение?"
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

<style lang="scss" scoped>
.invites-in-idea {
  @include textEllipsis(1);
  max-width: 250px;
  overflow-wrap: unset;
}
</style>
