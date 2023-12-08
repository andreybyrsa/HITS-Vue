<script lang="ts" setup>
import { ref } from 'vue'

import TeamInvitations from '@Components/Modals/TeamModal/TeamInvitations.vue'
import { MarketTablesProps } from '@Components/Modals/MarketModal/MarketModal.types'

defineProps<MarketTablesProps>()

const isAcceptedTeamsTable = ref(true)
const isRequestsToIdeaTable = ref(false)

function switchToAcceptedTeamsTable() {
  isAcceptedTeamsTable.value = true
  isRequestsToIdeaTable.value = false
}

function switchToRequestsToIdeaTable() {
  isRequestsToIdeaTable.value = true
  isAcceptedTeamsTable.value = false
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
          :class="getNavLinkStyle(isAcceptedTeamsTable)"
          @click="switchToAcceptedTeamsTable"
        >
          Принятые команды
        </div>
        <div
          :class="getNavLinkStyle(isRequestsToIdeaTable)"
          @click="switchToRequestsToIdeaTable"
        >
          Заявки
        </div>
      </ul>
    </div>

    <div class="idea-market-tables px-3 pb-3 pt-1">
      <TeamInvitations
        v-if="isAcceptedTeamsTable && acceptedTeams"
        :invitations="invitations"
      />

      <!-- <RequestsToTeam
        v-if="isRequestsToIdeaTable && requestTeams"
        :requests="requests"
        :team="team"
      />  -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-market-tables {
  max-height: 430px;
}
.nav-link {
  cursor: pointer;
}
</style>
