<script lang="ts" setup>
import { ref } from 'vue'

import { MarketRightSideProps } from '@Components/Modals/MarketModal/MarketModal.types'

import MarketSkillsRadarCharts from '@Components/Modals/MarketModal/MarketSkillsRadarCharts.vue'
import MarketInfo from '@Components/Modals/MarketModal/MarketInfo.vue'

import Button from '@Components/Button/Button.vue'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

defineProps<MarketRightSideProps>()

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

const isChangeContent = ref<boolean>(false)

function openMarketSkillsRadarCharts() {
  isChangeContent.value = true
}
function openMarketInfo() {
  isChangeContent.value = false
}
</script>

<template>
  <div class="header-buttons w-100 p-2 bg-white rounded">
    <Button
      :class-name="!isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
      @click="openMarketInfo"
    >
      Информация
    </Button>
    <Button
      :class-name="isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
      @click="openMarketSkillsRadarCharts"
    >
      Компетенции
    </Button>
  </div>

  <div v-if="isChangeContent">
    <MarketSkillsRadarCharts
      :skills="skills"
      v-model:skillsRequestTeam="skillsRequestTeam"
      v-model:skillsAcceptedTeam="skillsAcceptedTeam"
      :idea="idea"
    />
  </div>

  <MarketInfo
    v-else
    :idea-market="idea"
  />
</template>

<style lang="scss" scoped>
.header-buttons {
  @include flexible(flex-start, space-between, $gap: 8px);
}
</style>
