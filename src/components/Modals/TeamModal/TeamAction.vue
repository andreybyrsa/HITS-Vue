<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

import { TeamActionProps } from '@Components/Modals/TeamModal/TeamAction.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import RequestModal from '@Components/Modals/TeamModal/RequestModal.vue'
import InviteModal from '@Components/Modals/InviteModal/InviteModal.vue'

import { TeamRequest } from '@Domain/TeamRequest'
import useUserStore from '@Store/user/userStore'
import TeamService from '@Services/TeamService'
import RequestsAndInvitationsModal from './RequestsAndInvitationsModal.vue'
import { User } from '@Domain/User'
import ManageUsersService from '@Services/ManageUsersService'
import TeamActionButtons from './TeamActionButtons.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { deleteTeam } = TeamService
defineProps<TeamActionProps>()
const router = useRouter()

const disabled = ref<boolean>(false)

const profiles = ref<User[]>()

const teamId = ref<number>(0)
const isOpenedDeleteModal = ref<boolean>(false)
const isOpenedInviteModal = ref<boolean>(false)
const isOpenedRequestModal = ref<boolean>(false)
const isOpenedRequestsList = ref<boolean>(false)

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return //уведомление ошибки
    }
    profiles.value = response
  }
})

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
const handleInviteFromPortal = async (users: string[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.invitePortalUsers(
      { users: users },
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

const handleInviteFromOutside = async (emails: string[]) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.inviteOutsideUsers(
      teamId.value,
      { emails: emails },
      token,
    )
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
  }
  isOpenedInviteModal.value = false
}

const handleSendRequestToTheTeam = async (teamRequest: TeamRequest) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.requestToTheTeam(
      teamId.value,
      teamRequest,
      token,
    )
    if (response instanceof Error) {
      return // уведомление об ошибке
    }
    // уведомление об успехе
    isOpenedRequestModal.value = false
  }
}

const searchBySkill = (users: User[], searchedValue: string) => {
  return users.reduce<User[]>((optionsArray, option) => {
    const currentSkills = option.skills

    const isIncludesSeachedValue = currentSkills.find(
      (currentSkill) =>
        currentSkill.name.trim().toLocaleLowerCase() == searchedValue,
    )

    if (isIncludesSeachedValue) {
      optionsArray.push(option)
    }

    return optionsArray
  }, [])
}

function handleCloseDeleteModal() {
  isOpenedDeleteModal.value = false
  teamId.value = 0
}
function handleOpenDeleteModal(id: number) {
  teamId.value = id
  isOpenedDeleteModal.value = true
}
function handleCloseInviteModal() {
  isOpenedInviteModal.value = false
  teamId.value = 0
}
function handleOpenInviteModal(id: number) {
  teamId.value = id
  isOpenedInviteModal.value = true
}
function handleCloseRequestModal() {
  isOpenedRequestModal.value = false
  teamId.value = 0
}
function handleOpenRequestModal(id: number) {
  teamId.value = id
  isOpenedRequestModal.value = true
}
function handleCloseRequestsListModal() {
  isOpenedRequestsList.value = false
}
function handleOpenRequestsListModal() {
  isOpenedRequestsList.value = true
}
</script>
<template>
  <div
    class="team-action"
    v-if="team && user"
  >
    <TeamActionButtons :team="team" />

    <DeleteModal
      v-if="user?.email == team.owner.email"
      :is-opened="isOpenedDeleteModal"
      @close-modal="handleCloseDeleteModal"
      @delete="handleDeleteTeam()"
    />
    <InviteModal
      v-if="profiles"
      :users="profiles"
      :display-by="['firstName', 'lastName']"
      :email="'email'"
      name="teamMembers"
      :is-advanced-search="true"
      :is-opened="isOpenedInviteModal"
      @close-modal="handleCloseInviteModal"
      @invite-registered-users="handleInviteFromPortal"
      @invite-unregistered-users="handleInviteFromOutside"
      @search-by-advacned-field="searchBySkill"
    />
    <template v-if="user?.email != team.owner.email">
      <RequestModal
        v-if="team.members.find((member) => member.email == user?.email)"
        mode="write"
        type="leave"
        :sender="user"
        :is-opened="isOpenedRequestModal"
        @close-modal="handleCloseRequestModal"
        @request="handleSendRequestToTheTeam"
      />
      <RequestModal
        v-else
        type="enter"
        mode="write"
        :sender="user"
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
