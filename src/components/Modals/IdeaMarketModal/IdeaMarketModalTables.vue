<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { RequestTeamToIdea, InvitationTeamToIdea, Team } from '@Domain'
import { IdeaMarketTablesProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import RequestsToIdeaTable from '@Components/Tables/RequestsToIdeaTable/RequestsToIdeaTable.vue'
import IdeaMarketTeamsTable from '@Components/Tables/IdeaMarketTeamsTable/IdeaMarketTeamsTable.vue'
import InvitedTeamsToIdeaTable from '@Components/Tables/InvitedTeamsToIdeaTable/InvitedTeamsToIdeaTable.vue'
import Button from '@Components/Button/Button.vue'

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')
const invitedTeamsToIdea = defineModel<InvitationTeamToIdea[]>('InvitedTeamsToIdea')

const router = useRouter()

defineProps<IdeaMarketTablesProps>()

const isAcceptedTeamsTable = ref(true)
const isRequestsToIdeaTable = ref(false)
const isInvitedTeamsTable = ref(false)

function switchToAcceptedTeamsTable() {
  isAcceptedTeamsTable.value = true
  isRequestsToIdeaTable.value = false
  isInvitedTeamsTable.value = false
}

function switchToRequestsToIdeaTable() {
  isRequestsToIdeaTable.value = true
  isAcceptedTeamsTable.value = false
  isInvitedTeamsTable.value = false
}

function switchToInvitedTeamsTable() {
  isRequestsToIdeaTable.value = false
  isAcceptedTeamsTable.value = false
  isInvitedTeamsTable.value = true
}

function redirectToInviteTeamsToIdea() {
  router.push(`/teams/list`)
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
    <ul class="nav nav-underline border-bottom px-3">
      <div
        :class="getNavLinkStyle(isAcceptedTeamsTable)"
        @click="switchToAcceptedTeamsTable"
      >
        Принятая команда
      </div>
      <div
        :class="getNavLinkStyle(isRequestsToIdeaTable)"
        @click="switchToRequestsToIdeaTable"
      >
        Заявки
      </div>
      <div
        :class="getNavLinkStyle(isInvitedTeamsTable)"
        @click="switchToInvitedTeamsTable"
      >
        Приглашенные команды
      </div>
    </ul>

    <div class="idea-market-tables">
      <IdeaMarketTeamsTable
        v-if="isAcceptedTeamsTable"
        :idea-market="ideaMarket"
        v-model="skillsAcceptedTeam"
      />

      <RequestsToIdeaTable
        v-if="isRequestsToIdeaTable"
        :idea-market="ideaMarket"
        :requests="requestTeams ?? []"
        v-model="skillsRequestTeam"
      />

      <InvitedTeamsToIdeaTable
        v-if="isInvitedTeamsTable"
        :invitations="invitationsToTeams ?? []"
        :idea-market-id="ideaMarket.id"
        v-model="invitedTeamsToIdea"
      />
    </div>

    <Button
      @click="redirectToInviteTeamsToIdea"
      class-name="btn-invite-teams"
      variant="primary"
      v-if="isInvitedTeamsTable && invitationsToTeams"
    >
      Отправить приглашения
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.idea-market-tables {
  max-height: 430px;
  overflow-y: scroll;
}
.nav-link {
  cursor: pointer;
}
.my-btn {
  margin: 15px;
  margin-left: auto;
}

.btn-invite-teams {
  margin: 15px;
  margin-left: auto;
}
</style>
