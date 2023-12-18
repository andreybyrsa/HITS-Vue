<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'
import TeamInvitations from '@Components/Tables/TeamsTable/TeamInvitations.vue'
import RequestsToTeam from '@Components/Tables/TeamsTable/RequestsToTeam.vue'
import { TeamModalTables } from '@Components/Modals/TeamModal/TeamModal.types'

import useUserStore from '@Store/user/userStore'

const props = defineProps<TeamModalTables>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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

function getTeamInvitations() {
  const currentUser = user.value
  const { owner } = props.team

  return currentUser?.id === owner.id
}

function getRequestsToTeam() {
  const currentUser = user.value
  const { owner } = props.team

  return !props.team.closed && currentUser?.id === owner.id
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
          v-if="getTeamInvitations()"
          :class="getNavLinkStyle(isTeamInvitationsTable)"
          @click="switchToTeamInvitationsTable"
        >
          Приглашения
        </div>
        <div
          v-if="getRequestsToTeam()"
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
        :team="team"
      />

      <RequestsToTeam
        v-if="isRequestsToTeamTable && requests"
        :requests="requests"
        :team="team"
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
