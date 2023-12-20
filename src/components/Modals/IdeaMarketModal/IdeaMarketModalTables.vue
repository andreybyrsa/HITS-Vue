<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { IdeaMarketTablesProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import RequestsToIdeaTable from '@Components/Tables/RequestsToIdeaTable/RequestsToIdeaTable.vue'
import IdeaMarketTeamsTable from '@Components/Tables/IdeaMarketTeamsTable/IdeaMarketTeamsTable.vue'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<IdeaMarketTablesProps>()

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

function getAccessToTables() {
  const currentUser = user.value

  if (currentUser) {
    const { id, role } = currentUser
    const { id: initiatorId } = props.ideaMarket.initiator

    return id === initiatorId && role === 'INITIATOR'
  }
}
</script>

<template>
  <div
    v-if="getAccessToTables()"
    class="bg-white rounded-3"
  >
    <div class="border-bottom px-3">
      <ul class="nav nav-underline">
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
    </div>

    <div class="idea-market-tables px-3 pb-3 pt-1">
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
