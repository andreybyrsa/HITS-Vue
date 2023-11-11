<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { SkillsForRadar } from '@Components/Forms/TeamForm/TeamForm.types'

import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'
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

const skillsRequestTeamsData = computed<SkillsForRadar[]>(() => [
  { label: 'Компетенции идеи', skills: props.skills },
  { label: 'Компетенции команды', skills: filterSkillsRequestTeams() },
])

const skillsTeamsData = computed<SkillsForRadar[]>(() => [
  { label: 'Компетенции идеи', skills: props.skills },
  { label: 'Компетенции команды', skills: filterSkillsTeams() },
])

function filterSkillsRequestTeams() {
  if (skillsRequestTeam.value) {
    const skills = ref<Skill[]>([])
    skillsRequestTeam.value.forEach((team) =>
      team.skills.forEach((skill) => skills.value?.push(skill)),
    )

    const filterSkills: Skill[] = [...new Set(skills.value)]
    return filterSkills
  } else return []
}

function filterSkillsTeams() {
  if (skillsTeam.value) {
    const skills = ref<Skill[]>([])
    skillsTeam.value.forEach((team) =>
      team.skills.forEach((skill) => skills.value?.push(skill)),
    )

    const filterSkills: Skill[] = [...new Set(skills.value)]
    return filterSkills
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
