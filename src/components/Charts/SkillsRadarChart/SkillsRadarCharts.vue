<script lang="ts" setup>
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { RadarChart } from 'vue-chart-3'
import { Chart, registerables, ChartData } from 'chart.js'

import { SkillsRadarChartsProps } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import { Skill, SkillType } from '@Domain/Skill'

Chart.register(...registerables)

const props = defineProps<SkillsRadarChartsProps>()

type SkillsRadarChartType = ChartData<'radar', (number | null)[], string>

const languageSkills = ref<SkillsRadarChartType>()
const frameworkSkills = ref<SkillsRadarChartType>()
const databaseSkills = ref<SkillsRadarChartType>()
const devopsSkills = ref<SkillsRadarChartType>()

const ButtonClassName = computed(() => [props.className])

interface SkillData {
  label: string
  skills: { label: string; value: number }[]
}

function getSkillsData(label: string, skills: Skill[], type: SkillType): SkillData {
  const skillsByType = skills.filter((skill) => skill.type === type)

  const skillsData: SkillData = { label, skills: [] }
  const uniqueSkills = [
    ...new Map(skillsByType.map((skill) => [skill.id, skill])).values(),
  ]

  uniqueSkills.forEach((currentSkill) => {
    const skillAmount = skillsByType.reduce(
      (amount, skill) => (skill.id === currentSkill.id ? (amount += 1) : amount),
      0,
    )

    skillsData.skills.push({ label: currentSkill.name, value: skillAmount })
  })

  return skillsData
}

function findMissingSkillAndAdd(
  skillsDataSet: SkillData[],
  data: { label: string; value: number },
) {
  skillsDataSet.forEach((dataSet, index) => {
    const currentDataIndex = dataSet.skills.findIndex(
      ({ label }) => label === data.label,
    )

    if (currentDataIndex === -1) {
      dataSet.skills.splice(index, 0, { label: data.label, value: 0 })
    }
  })
}

function getSkillsDataSet(skillsDataSet: SkillData[]): SkillsRadarChartType {
  const totalSkillsDataSet: SkillsRadarChartType = { labels: [], datasets: [] }

  skillsDataSet.forEach((dataSet) => {
    dataSet.skills.forEach((data) => findMissingSkillAndAdd(skillsDataSet, data))
  })

  totalSkillsDataSet.labels = [
    ...new Set(
      skillsDataSet
        .map(({ skills }) => skills)
        .flat(1)
        .map(({ label }) => label),
    ).values(),
  ]

  skillsDataSet.forEach((dataSet) => {
    totalSkillsDataSet.datasets.push({
      label: dataSet.label,
      data: dataSet.skills.map(({ value }) => value),
    })
  })

  return totalSkillsDataSet
}

watchImmediate(
  () => props.skills,
  (currentSkills) => {
    const languageDataSet: SkillData[] = []
    const frameworkDataSet: SkillData[] = []
    const databaseDataSet: SkillData[] = []
    const devopsDataSet: SkillData[] = []

    currentSkills.forEach(({ label, skills }) => {
      languageDataSet.push(getSkillsData(label, skills, 'LANGUAGE'))
      frameworkDataSet.push(getSkillsData(label, skills, 'FRAMEWORK'))
      databaseDataSet.push(getSkillsData(label, skills, 'FRAMEWORK'))
      devopsDataSet.push(getSkillsData(label, skills, 'DEVOPS'))
    })

    languageSkills.value = getSkillsDataSet(languageDataSet)
    frameworkSkills.value = getSkillsDataSet(frameworkDataSet)
    databaseSkills.value = getSkillsDataSet(databaseDataSet)
    devopsSkills.value = getSkillsDataSet(devopsDataSet)
  },
  { deep: true },
)
</script>

<template>
  <div :class="['radar-charts', ...ButtonClassName]">
    <RadarChart
      v-if="languageSkills"
      :chart-data="languageSkills"
      :height="300"
    />

    <RadarChart
      v-if="frameworkSkills"
      :chart-data="frameworkSkills"
      :height="300"
    />

    <RadarChart
      v-if="databaseSkills"
      :chart-data="databaseSkills"
      :height="300"
    />

    <RadarChart
      v-if="devopsSkills"
      :chart-data="devopsSkills"
      :height="300"
    />
  </div>
</template>

<style lang="scss" scoped>
.radar-charts {
  @include flexible(center, center, $flex-wrap: wrap, $gap: 16px);

  &__chart {
    @include flexible(center, center);
  }

  &__placeholder {
    width: 130px;
    height: 130px;

    &-wrapper {
      @include flexible(center, center);
    }
  }
}
</style>
