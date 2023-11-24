<script lang="ts" setup>
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { RadarChart } from 'vue-chart-3'
import { Chart, registerables, ChartData } from 'chart.js'

import {
  SkillsRadarChartsProps,
  SkillData,
} from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import { Skill, SkillType } from '@Domain/Skill'

const props = defineProps<SkillsRadarChartsProps>()

Chart.register(...registerables)

type SkillsRadarChartType = ChartData<'radar', (number | null)[], string>

const languageSkills = ref<SkillsRadarChartType>()
const frameworkSkills = ref<SkillsRadarChartType>()
const databaseSkills = ref<SkillsRadarChartType>()
const devopsSkills = ref<SkillsRadarChartType>()

const ButtonClassName = computed(() => [props.className])

const getBackgroundColorBySkillType = (type: SkillType, alphaOpacity?: number) => {
  const hexAlphaOpacity = alphaOpacity ? alphaOpacity.toString(16) : 'ff'

  if (type === 'LANGUAGE') {
    return `#198653${hexAlphaOpacity}`
  }

  if (type === 'FRAMEWORK') {
    return `#0dcaf0${hexAlphaOpacity}`
  }

  if (type === 'DATABASE') {
    return `#ffc107${hexAlphaOpacity}`
  }

  return `#dc3545${hexAlphaOpacity}`
}

function getSkillsData(
  label: string,
  skills: Skill[],
  type: SkillType,
  alphaOpacity?: number,
): SkillData {
  const skillsByType = skills.filter((skill) => skill.type === type)

  const skillsData: SkillData = {
    label,
    skills: [],
    backgroundColor: getBackgroundColorBySkillType(type, alphaOpacity),
  }

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
    dataSet.skills
      .sort((a, b) => a.label.length - b.label.length)
      .forEach((data) => findMissingSkillAndAdd(skillsDataSet, data))
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
      backgroundColor: dataSet.backgroundColor,
      data: dataSet.skills.map(({ value }) => value),
    })
  })

  return totalSkillsDataSet
}

const chartId = ref(1)

watchImmediate(
  () => props.skills,
  (currentSkills) => {
    const languageData: SkillData[] = []
    const frameworkData: SkillData[] = []
    const databaseData: SkillData[] = []
    const devopsData: SkillData[] = []

    currentSkills.forEach(({ label, skills, alphaOpacity }) => {
      languageData.push(getSkillsData(label, skills, 'LANGUAGE', alphaOpacity))
      frameworkData.push(getSkillsData(label, skills, 'FRAMEWORK', alphaOpacity))
      databaseData.push(getSkillsData(label, skills, 'DATABASE', alphaOpacity))
      devopsData.push(getSkillsData(label, skills, 'DEVOPS', alphaOpacity))
    })
    languageSkills.value = getSkillsDataSet(languageData)
    frameworkSkills.value = getSkillsDataSet(frameworkData)
    databaseSkills.value = getSkillsDataSet(databaseData)
    devopsSkills.value = getSkillsDataSet(devopsData)
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
      :width="300"
    />

    <!-- <RadarChart
      v-if="frameworkSkills"
      :chart-data="frameworkSkills"
      :height="300"
      :width="300"
    />

    <RadarChart
      v-if="databaseSkills"
      :chart-data="databaseSkills"
      :height="300"
      :width="300"
    />

    <RadarChart
      v-if="devopsSkills"
      :chart-data="devopsSkills"
      :height="300"
      :width="300"
    /> -->
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
