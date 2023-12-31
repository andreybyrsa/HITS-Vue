<script lang="ts" setup>
import { ref } from 'vue'

import { IdeaMarketTablesProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import RequestsToIdeaTable from '@Components/Tables/RequestsToIdeaTable/RequestsToIdeaTable.vue'
import IdeaMarketTeamsTable from '@Components/Tables/IdeaMarketTeamsTable/IdeaMarketTeamsTable.vue'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

defineProps<IdeaMarketTablesProps>()

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
    </ul>

    <div class="idea-market-tables">
      <IdeaMarketTeamsTable
        v-if="isAcceptedTeamsTable"
        :idea-market="ideaMarket"
        v-model="skillsAcceptedTeam"
      />

      <RequestsToIdeaTable
        v-if="isRequestsToIdeaTable && requestTeams"
        :idea-market="ideaMarket"
        :requests="requestTeams"
        v-model="skillsRequestTeam"
      />
    </div>
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
</style>
