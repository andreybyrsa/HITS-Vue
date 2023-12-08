<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import TeamModalPlaceholder from '@Components/Modals/TeamModal/TeamModalPlaceholder.vue'
import TeamDescription from '@Components/Modals/TeamModal/TeamDescription.vue'
import TeamModalActions from '@Components/Modals/TeamModal/TeamModalActions.vue'
import TeamModalInfo from '@Components/Modals/TeamModal/TeamModalInfo.vue'
import TeamModalTables from '@Components/Modals/TeamModal/TeamModalTables.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import {
  Team,
  TeamInvitation,
  RequestToTeam,
  TeamSkills,
  TeamMember,
} from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useRequestsToTeamStore from '@Store/requestsToTeam/requestsToTeamStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import TeamService from '@Services/TeamService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsStore = useTeamStore()
const requestsToTeamStore = useRequestsToTeamStore()

const notificationsStore = useNotificationsStore()

const route = useRoute()
const router = useRouter()

const team = ref<Team>()
const teamInvitations = ref<TeamInvitation[]>()
const requestsToTeam = ref<RequestToTeam[]>()

const invitatinUsers = useInvitationUsersStore()

const isOpened = ref<boolean>(true)

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

// const handleKick = async (member: TeamMember, teamId: number) => {
//   const currentUser = user.value
//   if (currentUser?.token) {
//     const { token } = currentUser
//     const response = await TeamService.kickTeamMember(member.id, token)

//     if (response instanceof Error) {
//       return
//     }
//   }
// }

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const id = route.params.teamId.toString()
    const { token } = currentUser

    const ideaParallelRequests = [
      () => teamsStore.getTeam(id, token),
      () => requestsToTeamStore.getRequestsToTeam(id, token),
      () => invitatinUsers.getInvitationUsers(id, token),
    ]

    await makeParallelRequests<
      Team | TeamSkills | TeamInvitation[] | undefined | RequestToTeam[] | Error
    >(ideaParallelRequests).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, team)
        } else if (response.id === 1) {
          checkResponseStatus(response, requestsToTeam)
        } else if (response.id === 2) {
          checkResponseStatus(response, teamInvitations)
        }
      })
    })
  }
})

function closeTeamModal() {
  isOpened.value = false
  router.go(-1)
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    appear-on-render
    @on-outside-close="closeTeamModal"
  >
    <div
      v-if="team"
      class="team-modal p-3 h-100 overflow-y-scroll"
    >
      <div class="team-modal__left-side w-75">
        <TeamDescription
          :team="team"
          @close-modal="closeTeamModal"
        />

        <TeamModalTables
          :team="team"
          :invitations="teamInvitations"
          :requests="requestsToTeam"
        />

        <TeamModalActions
          :team="team"
          @close-modal="closeTeamModal"
        />
      </div>

      <div class="team-modal__right-side rounded-3 w-25 bg-white">
        <TeamModalInfo :team="team" />
      </div>
    </div>

    <TeamModalPlaceholder v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.team-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .team-modal,
.modal-layout-leave-to .team-modal {
  transform: translateX(100%);
}
</style>
