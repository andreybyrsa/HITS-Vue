<script lang="ts" setup>
import { computed } from 'vue'

import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'
import SkillsRadarCharts from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { IdeaMarketSkillsProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'

import { Skill } from '@Domain/Skill'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

const props = defineProps<IdeaMarketSkillsProps>()

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

const skillsRequestTeamsData = computed<SkillsArea[]>(() => [
  { label: 'Компетенции идеи', skills: props.skills, alphaOpacity: 100 },
  {
    label: 'Компетенции команды',
    skills: filterSkillsTeams(),
    alphaOpacity: 50,
  },
])

function filterSkillsTeams() {
  if (skillsAcceptedTeam.value && skillsRequestTeam.value) {
    const skills: Skill[] = []
    skills.push(...skillsAcceptedTeam.value.skills)
    skillsRequestTeam.value.forEach((team) => skills.push(...team.skills))

    return skills
  } else {
    const skills: Skill[] = []
    skillsRequestTeam.value?.forEach((team) => skills.push(...team.skills))

    return skills
  }
}
</script>

<template>
  <div class="bg-white rounded w-100 mb-3">
    <div
      class="market-skills-radar-charts w-100 bg-primary rounded-top fs-5 text-white p-2 mb-2"
    >
      Компетенции
    </div>
    <SkillsRadarCharts
      class-name="w-100"
      :skills="skillsRequestTeamsData"
      :width="250"
      :height="250"
    />
  </div>
</template>

<style lang="scss" scoped>
.market-skills-radar-charts {
  @include flexible(center, center);
}
</style>
