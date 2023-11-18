<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { SkillsForRadar } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import SkillsRadarCharts from '@Components/Charts/SkillsRadarChart/SkillsRadarCharts.vue'
import { MarketSkillsradarChartsProps } from '@Components/Modals/MarketModal/MarketModal.types'

import useUserStore from '@Store/user/userStore'

import { Skill } from '@Domain/Skill'
import RequestTeams from '@Domain/RequestTeams'
import Team from '@Domain/Team'

const props = defineProps<MarketSkillsradarChartsProps>()

const skillsRequestTeam = defineModel<RequestTeams[]>('skillsRequestTeam')
const skillsTeam = defineModel<Team[]>('skillsTeam')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const skillsRequestTeamsData = computed<SkillsForRadar[]>(() => {
  const a = [{ label: 'Компетенции идеи', skills: props.skills }]
  if (skillsRequestTeam.value?.length) {
    a.push({ label: 'Компетенции команды', skills: filterSkillsRequestTeams() })
  }
  return a
})

const skillsTeamsData = computed<SkillsForRadar[]>(() => [
  { label: 'Компетенции идеи', skills: props.skills },
  { label: 'Компетенции команды', skills: filterSkillsTeams() },
])

function filterSkillsRequestTeams() {
  if (skillsRequestTeam.value) {
    const skills: Skill[] = []
    skillsRequestTeam.value.forEach((team) => skills.push(...team.skills))

    return skills
  } else return []
}

function filterSkillsTeams() {
  if (skillsTeam.value) {
    const skills: Skill[] = []
    skillsTeam.value.forEach((team) => skills.push(...team.skills))

    return skills
  } else return []
}
</script>

<template>
  <div class="bg-white rounded">
    <div
      class="market-skills-radar-charts w-100 bg-primary rounded-top fs-5 text-white p-2 mb-2"
    >
      Компетенции
    </div>
    <SkillsRadarCharts
      v-if="user?.email == idea.initiator.email"
      class-name="w-100"
      :skills="skillsRequestTeamsData"
      is-not-placeholder
    />
    <SkillsRadarCharts
      v-else
      class-name="w-100"
      :skills="skillsTeamsData"
      is-not-placeholder
    />
  </div>
</template>

<style lang="scss" scoped>
.market-skills-radar-charts {
  @include flexible(center, center);
}
</style>
