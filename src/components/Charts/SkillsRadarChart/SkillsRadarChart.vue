<script lang="ts" setup>
import { Ref, ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'

import {
  SkillsRadarChartsProps,
  SkillsData,
  UniqueSkill,
} from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import { Skill, SkillType } from '@Domain/Skill'

const props = defineProps<SkillsRadarChartsProps>()

type SkillsSeries = { name: string; data: number[] }[]

const defaultRadarOptions: ApexOptions = {
  chart: { type: 'radar', toolbar: { show: false } },
  yaxis: {
    labels: {
      formatter: (value) => value.toFixed(0),
      offsetX: 8,
      offsetY: 3,
    },
  },
  grid: {
    padding: { left: 30 },
  },
  legend: {
    offsetY: -15,
  },
  markers: { size: 4 },
}

const languageRadarOptions = ref<ApexOptions>(defaultRadarOptions)
const frameworkRadarOptions = ref<ApexOptions>(defaultRadarOptions)
const databaseRadarOptions = ref<ApexOptions>(defaultRadarOptions)
const devopsRadarOptions = ref<ApexOptions>(defaultRadarOptions)

const RadarChartsClassName = computed(() => ['radar-charts', props.className])

watchImmediate(
  () => props.skills,
  (currentSkills) => {
    const languageDataSet: SkillsData[] = []
    const frameworkDataSet: SkillsData[] = []
    const databaseDataSet: SkillsData[] = []
    const devopsDataSet: SkillsData[] = []

    currentSkills.forEach(({ label, skills, alphaOpacity }) => {
      languageDataSet.push(getSkillsData(label, skills, 'LANGUAGE', alphaOpacity))
      frameworkDataSet.push(getSkillsData(label, skills, 'FRAMEWORK', alphaOpacity))
      databaseDataSet.push(getSkillsData(label, skills, 'DATABASE', alphaOpacity))
      devopsDataSet.push(getSkillsData(label, skills, 'DEVOPS', alphaOpacity))
    })

    setRadarOptions(languageRadarOptions, languageDataSet)
    setRadarOptions(frameworkRadarOptions, frameworkDataSet)
    setRadarOptions(databaseRadarOptions, databaseDataSet)
    setRadarOptions(devopsRadarOptions, devopsDataSet)
  },
  { deep: true },
)

function getBackgroundColorBySkillType(type: SkillType, alphaOpacity?: number) {
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
): SkillsData {
  const skillsByType = skills.filter((skill) => skill.type === type)

  const skillsData: SkillsData = {
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
  skillsDataSet: SkillsData[],
  uniqueSkill: UniqueSkill,
) {
  skillsDataSet.forEach((dataSet, index) => {
    const currentDataIndex = dataSet.skills.findIndex(
      ({ label }) => label === uniqueSkill.label,
    )

    if (currentDataIndex === -1) {
      dataSet.skills.splice(index, 0, { label: uniqueSkill.label, value: 0 })
    }
  })
}

function setRadarOptions(
  radarOptions: Ref<ApexOptions>,
  skillsDataSet: SkillsData[],
) {
  skillsDataSet.forEach((dataSet) => {
    dataSet.skills
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1
        }
        if (a.label > b.label) {
          return 1
        }
        return 0
      })
      .forEach((data) => findMissingSkillAndAdd(skillsDataSet, data))
  })

  const dataSets = skillsDataSet.map(({ skills }) => skills).flat(1)
  const crossingDataSet: SkillsData = {
    label: 'Пересечение',
    skills: [],
    backgroundColor: '#00000040',
  }

  dataSets.forEach((skill, index1) => {
    const crossingSkill = dataSets.find(
      ({ label, value }, index2) =>
        index1 !== index2 && label === skill.label && value + skill.value === 2,
    )

    if (
      crossingSkill &&
      !crossingDataSet.skills.find(({ label }) => label === crossingSkill.label)
    ) {
      crossingDataSet.skills.push(crossingSkill)
    }
  })
  skillsDataSet.push(crossingDataSet)

  skillsDataSet.forEach((dataSet) => {
    dataSet.skills
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1
        }
        if (a.label > b.label) {
          return 1
        }
        return 0
      })
      .forEach((data) => findMissingSkillAndAdd(skillsDataSet, data))
  })

  const series: SkillsSeries = skillsDataSet.map(({ label, skills }) => ({
    name: label,
    data: skills.map(({ value }) => value),
  }))

  const xaxis = {
    categories: [
      ...new Set(
        skillsDataSet
          .map(({ skills }) => skills)
          .flat(1)
          .map(({ label }) => label),
      ).values(),
    ],
  }

  const colors = skillsDataSet.map(({ backgroundColor }) => backgroundColor)

  radarOptions.value = {
    ...radarOptions.value,
    series,
    xaxis,
    colors,
  }
}
</script>

<template>
  <div :class="RadarChartsClassName">
    <VueApexCharts
      v-if="languageRadarOptions.series?.length"
      :options="languageRadarOptions"
      :series="languageRadarOptions.series"
      :width="width"
      :height="height"
    />

    <VueApexCharts
      v-if="frameworkRadarOptions.series?.length"
      :options="frameworkRadarOptions"
      :series="frameworkRadarOptions.series"
      :width="width"
      :height="height"
    />

    <VueApexCharts
      v-if="databaseRadarOptions.series?.length"
      :options="databaseRadarOptions"
      :series="databaseRadarOptions.series"
      :width="width"
      :height="height"
    />

    <VueApexCharts
      v-if="devopsRadarOptions.series?.length"
      :options="devopsRadarOptions"
      :series="devopsRadarOptions.series"
      :width="width"
      :height="height"
    />
  </div>
</template>

<style lang="scss" scoped>
.radar-charts {
  @include flexible(center, center, $flex-wrap: wrap);
}
</style>
