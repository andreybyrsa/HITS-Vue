<script lang="ts" setup>
import { ref } from 'vue'

import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'
import TeamInvitations from '@Components/Modals/TeamModal/TeamInvitations.vue'
import RequestsToTeam from '@Components/Modals/TeamModal/RequestsToTeam.vue'
import { TeamModalTables } from '@Components/Modals/TeamModal/TeamModal.types'

defineProps<TeamModalTables>()

const isTeamMembersTable = ref(true)
const isTeamInvitationsTable = ref(false)
const isRequestsToTeamTable = ref(false)

function switchToTeamMembersTable() {
  isTeamMembersTable.value = true

  isTeamInvitationsTable.value = false
  isRequestsToTeamTable.value = false
}

function switchToTeamInvitationsTable() {
  isTeamInvitationsTable.value = true

  isTeamMembersTable.value = false
  isRequestsToTeamTable.value = false
}

function switchToRequestsToTeamTable() {
  isRequestsToTeamTable.value = true

  isTeamMembersTable.value = false
  isTeamInvitationsTable.value = false
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
          :class="getNavLinkStyle(isTeamInvitationsTable)"
          @click="switchToTeamInvitationsTable"
        >
          Приглашения
        </div>
        <div
          :class="getNavLinkStyle(isRequestsToTeamTable)"
          @click="switchToRequestsToTeamTable"
        >
          Заявки
        </div>
      </ul>
    </div>

    <div class="team-tables px-3 pb-3 pt-1">
      <TeamMembers
        v-if="isTeamMembersTable"
        :team="team"
      />

      <TeamInvitations
        v-if="isTeamInvitationsTable && invitations"
        :invitations="invitations"
      />

      <RequestsToTeam
        v-if="isRequestsToTeamTable && requests"
        :requests="requests"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-tables {
  max-height: 430px;
}
.nav-link {
  cursor: pointer;
}
</style>
