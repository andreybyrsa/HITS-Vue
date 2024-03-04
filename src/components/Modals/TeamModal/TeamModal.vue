<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { IdeaMarket, Team, TeamInvitation, RequestToTeam } from '@Domain'
import {
  useUserStore,
  useTeamStore,
  useInvitationUsersStore,
  useRequestsToTeamStore,
  useRequestsToIdeaStore,
  useInvitationsTeamToIdeaStore,
} from '@Store'
import { IdeaMarketService } from '@Service'
import { sendParallelRequests, RequestConfig, openErrorNotification } from '@Utils'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TeamModalPlaceholder from '@Components/Modals/TeamModal/TeamModalPlaceholder.vue'
import TeamDescription from '@Components/Modals/TeamModal/TeamDescription.vue'
import TeamModalActions from '@Components/Modals/TeamModal/TeamModalActions.vue'
import TeamModalInfo from '@Components/Modals/TeamModal/TeamModalInfo.vue'
import TeamModalTables from '@Components/Modals/TeamModal/TeamModalTables.vue'

const requestsToIdea = useRequestsToIdeaStore()
const { requestsTeamsToIdea } = storeToRefs(requestsToIdea)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const invitationsTeamToIdeaStore = useInvitationsTeamToIdeaStore()
const { ideaInvitations } = storeToRefs(invitationsTeamToIdeaStore)

const teamsStore = useTeamStore()
const requestsToTeamStore = useRequestsToTeamStore()

const route = useRoute()
const router = useRouter()

const team = ref<Team>()
const teamInvitations = ref<TeamInvitation[]>()
const requestsToTeam = ref<RequestToTeam[]>()
const ideasMarketInitiator = ref<IdeaMarket[]>([])

const invitatinUsers = useInvitationUsersStore()

const isOpened = ref<boolean>(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser) {
    const id = route.params.teamId.toString()
    const { role, id: userId } = currentUser

    const teamParallelRequests: RequestConfig[] = [
      {
        request: () => teamsStore.getTeam(id),
        refValue: team,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => requestsToTeamStore.getRequestsToTeam(id),
        refValue: requestsToTeam,
        statement: role === 'TEAM_OWNER' || role === 'MEMBER' || role === 'ADMIN',
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => invitatinUsers.getInvitationUsers(id),
        refValue: teamInvitations,
        statement: role === 'TEAM_OWNER' || role === 'MEMBER' || role === 'ADMIN',
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => requestsToIdea.getTeamRequestsToIdeas(id),
        refValue: requestsTeamsToIdea,
        statement:
          role === 'TEAM_OWNER' ||
          role === 'MEMBER' ||
          role === 'PROJECT_OFFICE' ||
          role === 'INITIATOR' ||
          role === 'ADMIN',
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => IdeaMarketService.getAllInitiatorMarketIdeasByUserId(userId),
        refValue: ideasMarketInitiator,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(teamParallelRequests)
  }
})

watch(
  team,
  async () => {
    if (team.value?.id) {
      const { id: teamId } = team.value
      await invitationsTeamToIdeaStore.getTeamInvitations(teamId)
    }
  },
  { deep: true },
)

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
          :requestsTeamsToIdea="requestsTeamsToIdea"
          :invitationsForTeam="ideaInvitations"
        />

        <TeamModalActions
          :ideasInitiator="ideasMarketInitiator"
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
