<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import {
  TeamActionProps,
  TeamButtonAction,
  teamButtons,
} from '@Components/Modals/TeamModal/TeamAction.types'
import Button from '@Components/Button/Button.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import { Letter } from '@Components/Modals/TeamModal/RequestModal.types'
import RequestModal from '@Components/Modals/TeamModal/RequestModal.vue'
import InviteModal from '@Components/Modals/InviteModal/InviteModal.vue'

import Team from '@Domain/Team'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import TeamService from '@Services/TeamService'
import RequestsAndInvitationsModal from './RequestsAndInvitationsModal.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { deleteTeam } = TeamService
const props = defineProps<TeamActionProps>()
const router = useRouter()

const disabled = ref<boolean>(false)

const teamId = ref<string>('')
const isOpenedDeleteModal = ref<boolean>(false)
const isOpenedInviteModal = ref<boolean>(false)
const isOpenedRequestModal = ref<boolean>(false)
const isOpenedRequestsList = ref<boolean>(false)

const handleDeleteTeam = async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await deleteTeam(teamId.value, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
    isOpenedDeleteModal.value = false
    router.push('/teams/list')
  }
}
const handleInviteFromPortal = async (users: User[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.invitePortalUsers(users, teamId.value, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
  }
  isOpenedInviteModal.value = false
}

const handleInviteFromOutside = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.inviteOutsideUsers(
      emails,
      teamId.value,
      token,
    )
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
  }
  isOpenedInviteModal.value = false
}

const handleSendRequestToTheTeam = async (letter: Letter) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.requestToTheTeam(teamId.value, letter, token)
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
    isOpenedRequestModal.value = false
  }
}

function handleCloseDeleteModal() {
  isOpenedDeleteModal.value = false
  teamId.value = ''
}
function handleOpenDeleteModal(id: string) {
  teamId.value = id
  isOpenedDeleteModal.value = true
}
function handleCloseInviteModal() {
  isOpenedInviteModal.value = false
  teamId.value = ''
}
function handleOpenInviteModal(id: string) {
  teamId.value = id
  isOpenedInviteModal.value = true
}
function handleCloseRequestModal() {
  isOpenedRequestModal.value = false
  teamId.value = ''
}
function handleOpenRequestModal(id: string) {
  teamId.value = id
  isOpenedRequestModal.value = true
}
function handleCloseRequestsListModal() {
  isOpenedRequestsList.value = false
}
function handleOpenRequestsListModal() {
  isOpenedRequestsList.value = true
}

function shareButton(id: string) {
  navigator.clipboard.writeText('http://localhost:8080/team/' + id)
  disabled.value = true
}

function checkButton(button: TeamButtonAction) {
  const currentUser = user.value
  const currentTeam = props.team
  if (currentUser && currentTeam) {
    return (
      ((button.name == 'Редактировать' || button.name == 'Удалить команду') &&
        currentUser.email == currentTeam.owner.email) ||
      (button.name == 'Пригласить в команду' &&
        (currentUser.email == currentTeam.owner.email ||
          currentUser.email == currentTeam.leader.email)) ||
      (button.name == 'Подать заявку на вступление' &&
        !currentTeam.members.find((member) => member.email == currentUser.email) &&
        currentUser.email != currentTeam.owner.email &&
        currentUser.email != currentTeam.leader.email &&
        !currentTeam.isClosed) ||
      (button.name == 'Подать заявку на выход' &&
        currentTeam.owner.email != currentUser.email &&
        currentTeam.members.find((member) => member.email == currentUser.email)) ||
      (button.name == 'Раcсмотреть заявки' &&
        (currentUser.email == currentTeam.owner.email ||
          currentUser.email == currentTeam.leader.email))
    )
  }
}

function handleClick(button: TeamButtonAction, team: Team) {
  button.name == 'Удалить команду'
    ? handleOpenDeleteModal(team.id)
    : button.name == 'Пригласить в команду'
    ? handleOpenInviteModal(team.id)
    : button.name == 'Подать заявку на вступление' ||
      button.name == 'Подать заявку на выход'
    ? handleOpenRequestModal(team.id)
    : button.name == 'Редактировать'
    ? router.push(`/teams/edit/${team.id}`)
    : button.name == 'Раcсмотреть заявки'
    ? handleOpenRequestsListModal()
    : button.name == 'Подать заявку на вступление'
}
</script>
<template>
  <div
    class="team-action"
    v-if="team"
  >
    <template
      v-for="button in teamButtons"
      :key="button.id"
    >
      <Button
        :class-name="button.buttonClass + ' w-100'"
        v-if="checkButton(button)"
        @click="handleClick(button, team)"
        >{{ button.name }}</Button
      >
      <Button
        v-if="button.name == 'Скопировать ссылку'"
        :class-name="button.buttonClass + ' w-100'"
        @click="shareButton(team?.id)"
        :disabled="disabled"
        >{{ disabled ? 'Ссылка скопирована!' : button.name }}</Button
      >
    </template>

    <DeleteModal
      v-if="user?.email == team.owner.email"
      :is-opened="isOpenedDeleteModal"
      @close-modal="handleCloseDeleteModal"
      @delete="handleDeleteTeam()"
    />
    <InviteModal
      v-if="user"
      name="teamMembers"
      advanced-info="skills"
      :is-opened="isOpenedInviteModal"
      @close-modal="handleCloseInviteModal"
      @invite-registered-users="handleInviteFromPortal"
      @invite-unregistered-users="handleInviteFromOutside"
    />
    <template v-if="user && user?.email != team.owner.email">
      <RequestModal
        v-if="team.members.find((member) => member.email == user?.email)"
        type="leave"
        :is-opened="isOpenedRequestModal"
        @close-modal="handleCloseRequestModal"
        @request="handleSendRequestToTheTeam"
      />
      <RequestModal
        v-else
        type="enter"
        :is-opened="isOpenedRequestModal"
        @close-modal="handleCloseRequestModal"
        @request="handleSendRequestToTheTeam"
      />
    </template>
    <RequestsAndInvitationsModal
      :is-opened="isOpenedRequestsList"
      :team="team"
      @close-modal="handleCloseRequestsListModal"
    ></RequestsAndInvitationsModal>
  </div>
</template>
<style lang="scss" scoped>
.team-action {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
