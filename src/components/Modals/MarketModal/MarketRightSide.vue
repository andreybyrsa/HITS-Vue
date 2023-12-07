<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { MarketRightSideProps } from '@Components/Modals/MarketModal/MarketModal.types'

import MarketSkillsRadarCharts from '@Components/Modals/MarketModal/MarketSkillsRadarCharts.vue'
import MarketInfo from '@Components/Modals/MarketModal/MarketInfo.vue'

import useUserStore from '@Store/user/userStore'

import Button from '@Components/Button/Button.vue'

import RequestTeams from '@Domain/RequestTeams'
import { Team } from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<MarketRightSideProps>()

const skillsRequestTeam = defineModel<RequestTeams[]>('skillsRequestTeam')
const skillsTeam = defineModel<Team[]>('skillsTeam')

const isChangeContent = ref<boolean>(true)

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
      :class-name="isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
      @click="openMarketSkillsRadarCharts"
      >Компетенции</Button
    >
    <Button
      :class-name="!isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
      @click="openMarketInfo"
      >Информация</Button
    >
  </div>
  <div v-if="isChangeContent">
    <MarketSkillsRadarCharts
      v-if="user?.email == idea.initiator.email"
      :skills="skills"
      v-model:skillsRequestTeam="skillsRequestTeam"
      :idea="idea"
    />
    <MarketSkillsRadarCharts
      v-else
      :skills="skills"
      v-model:skillsTeam="skillsTeam"
      :idea="idea"
    />
  </div>

  <MarketInfo
    v-else
    :idea="idea"
  />
</template>

<style lang="scss" scoped>
.header-buttons {
  @include flexible(flex-start, space-between, $gap: 8px);
}
</style>
