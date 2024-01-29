<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'
import TeamInvitations from '@Components/Tables/TeamsTable/TeamInvitations.vue'
import RequestsToTeam from '@Components/Tables/TeamsTable/RequestsToTeam.vue'
import RequestTeamToIdea from '@Components/Tables/TeamsTable/RequestsTeamToIdea.vue'
import InvitationsToIdeaForTeam from '@Components/Tables/TeamsTable/InvitationsToIdeaForTeam.vue'
import { TeamModalTables } from '@Components/Modals/TeamModal/TeamModal.types'

import useUserStore from '@Store/user/userStore'

const props = defineProps<TeamModalTables>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isTeamMembersTable = ref(true)
const isTeamInvitationsTable = ref(false)
const isRequestsToTeamTable = ref(false)
const isRequestTeamToIdeaTable = ref(false)
const isInvitationTeamToIdeaTable = ref(false)

function switchToTeamMembersTable() {
  isTeamMembersTable.value = true

  isTeamInvitationsTable.value = false
  isRequestsToTeamTable.value = false
  isRequestTeamToIdeaTable.value = false
  isInvitationTeamToIdeaTable.value = false
}

function switchToTeamInvitationsTable() {
  isTeamInvitationsTable.value = true

  isTeamMembersTable.value = false
  isRequestsToTeamTable.value = false
  isRequestTeamToIdeaTable.value = false
  isInvitationTeamToIdeaTable.value = false
}

function switchToRequestsToTeamTable() {
  isRequestsToTeamTable.value = true

  isTeamMembersTable.value = false
  isTeamInvitationsTable.value = false
  isRequestTeamToIdeaTable.value = false
  isInvitationTeamToIdeaTable.value = false
}

function switchToRequestTeamToIdeaTable() {
  isRequestTeamToIdeaTable.value = true

  isTeamMembersTable.value = false
  isTeamInvitationsTable.value = false
  isRequestsToTeamTable.value = false
  isInvitationTeamToIdeaTable.value = false
}

function switchToInvitationTeamToIdeaTable() {
  isInvitationTeamToIdeaTable.value = true

  isRequestTeamToIdeaTable.value = false
  isTeamMembersTable.value = false
  isTeamInvitationsTable.value = false
  isRequestsToTeamTable.value = false
}

function getNavLinkStyle(isCurrentTable: boolean) {
  return [
    'nav-link',
    'fw-normal',
    'pb-1',
    { 'active text-primary': isCurrentTable },
    { 'text-secondary': !isCurrentTable },
  ]
}

function getAccessToViewTable() {
  const currentUser = user.value
  const { owner } = props.team

  return (
    (currentUser?.id === owner.id && currentUser.role === 'TEAM_OWNER') ||
    currentUser?.role === 'ADMIN'
  )
}

function getAccessToRequestsToTeam() {
  return !props.team.closed && getAccessToViewTable()
}
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="border-bottom px-3">
      <ul class="nav nav-underline">
        <div
          :class="getNavLinkStyle(isTeamMembersTable)"
          @click="switchToTeamMembersTable"
        >
          Участники
        </div>
        <div
          v-if="getAccessToViewTable()"
          :class="getNavLinkStyle(isTeamInvitationsTable)"
          @click="switchToTeamInvitationsTable"
        >
          Приглашения
        </div>
        <div
          v-if="getAccessToRequestsToTeam()"
          :class="getNavLinkStyle(isRequestsToTeamTable)"
          @click="switchToRequestsToTeamTable"
        >
          Заявки в команду
        </div>
        <div
          v-if="getAccessToViewTable()"
          :class="getNavLinkStyle(isRequestTeamToIdeaTable)"
          @click="switchToRequestTeamToIdeaTable"
        >
          Заявки в идеи
        </div>
        <div
          v-if="getAccessToViewTable()"
          :class="getNavLinkStyle(isInvitationTeamToIdeaTable)"
          @click="switchToInvitationTeamToIdeaTable"
        >
          Приглашения в идеи
        </div>
      </ul>
    </div>

    <div class="team-tables">
      <TeamMembers
        v-if="isTeamMembersTable"
        :team="team"
      />

      <TeamInvitations
        v-if="isTeamInvitationsTable && invitations"
        :invitations="invitations"
        :team="team"
      />

      <RequestsToTeam
        v-if="isRequestsToTeamTable && requests"
        :requests="requests"
        :team="team"
      />

      <RequestTeamToIdea
        v-if="isRequestTeamToIdeaTable && requestsTeamsToIdea"
        :requests="requestsTeamsToIdea"
      />
      <InvitationsToIdeaForTeam
        v-if="isInvitationTeamToIdeaTable && invitationsForTeam"
        :invitations="invitationsForTeam"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-tables {
  max-height: 430px;

  overflow: scroll;
}
.nav-link {
  cursor: pointer;
}
</style>
