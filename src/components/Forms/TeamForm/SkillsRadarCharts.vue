<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'
import { RadarChart } from 'vue-chart-3'
import { Chart, registerables, ChartData } from 'chart.js'

import { SkillsRadarChartsProps } from '@Components/Forms/TeamForm/TeamForm.types'
import Typography from '@Components/Typography/Typography.vue'

import { Skill, SkillType } from '@Domain/Skill'

Chart.register(...registerables)

const props = defineProps<SkillsRadarChartsProps>()

const route = useRoute()

type SkillsRadarChartType = ChartData<'radar', (number | null)[], string>

const languageSkills = ref<SkillsRadarChartType>()
const frameworkSkills = ref<SkillsRadarChartType>()
const databaseSkills = ref<SkillsRadarChartType>()
const devopsSkills = ref<SkillsRadarChartType>()

const languageSkillsIdea = ref<SkillsRadarChartType>()
const frameworkSkillsIdea = ref<SkillsRadarChartType>()
const databaseSkillsIdea = ref<SkillsRadarChartType>()
const devopsSkillsIdea = ref<SkillsRadarChartType>()

const languageSkillsTeam = ref<SkillsRadarChartType>()
const frameworkSkillsTeam = ref<SkillsRadarChartType>()
const databaseSkillsTeam = ref<SkillsRadarChartType>()
const devopsSkillsTeam = ref<SkillsRadarChartType>()

const radarChartPlaceholder = ref('Вычисление диаграм')

const skillsData = computed(() => [
  { data: languageSkillsIdea.value },
  { data: frameworkSkillsIdea.value },
  { data: databaseSkillsIdea.value },
  { data: devopsSkillsIdea.value },
])

const skillsDataTeam = computed(() => [
  { data: languageSkillsTeam.value },
  { data: frameworkSkillsTeam.value },
  { data: databaseSkillsTeam.value },
  { data: devopsSkillsTeam.value },
])

const allSkills = computed(() => [
  {
    data:
      languageSkillsIdea.value && languageSkillsTeam.value
        ? getAllSkillsData(languageSkillsIdea.value, languageSkillsTeam.value)
        : languageSkillsIdea.value
        ? languageSkillsIdea.value
        : languageSkillsTeam.value,
  },
  {
    data:
      frameworkSkillsIdea.value && frameworkSkillsTeam.value
        ? getAllSkillsData(frameworkSkillsIdea.value, frameworkSkillsTeam.value)
        : frameworkSkillsIdea.value
        ? frameworkSkillsIdea.value
        : frameworkSkillsTeam.value,
  },
  {
    data:
      databaseSkillsIdea.value && databaseSkillsTeam.value
        ? getAllSkillsData(databaseSkillsIdea.value, databaseSkillsTeam.value)
        : databaseSkillsIdea.value
        ? databaseSkillsIdea.value
        : databaseSkillsTeam.value,
  },
  {
    data:
      devopsSkillsIdea.value && devopsSkillsTeam.value
        ? getAllSkillsData(devopsSkillsIdea.value, devopsSkillsTeam.value)
        : devopsSkillsIdea.value
        ? devopsSkillsIdea.value
        : devopsSkillsTeam.value,
  },
])

const ButtonClassName = computed(() => [props.className])

function getSkillsData(skills: Skill[], type: SkillType) {
  const skillsByType = skills.filter((skill) => skill.type === type)

  if (skillsByType.length === 0) {
    return undefined
  }

  const uniqueSkills = [
    ...new Map(skillsByType.map((skill) => [skill.id, skill])).values(),
  ]

  const skillsLabels = uniqueSkills.map((skill) => skill.name)
  const skillsValues: number[] = []

  uniqueSkills.forEach((currentSkill) => {
    const skillAmount = skillsByType.reduce(
      (amount, skill) => (skill.id === currentSkill.id ? (amount += 1) : amount),
      0,
    )

    skillsValues.push(skillAmount)
  })

  const getOptionsBySkillType = (type: SkillType) => {
    switch (type) {
      case 'LANGUAGE':
        return { label: 'Языки разработки идеи', backgroundColor: '#19865380' }
      case 'FRAMEWORK':
        return { label: 'Фреймворки идеи', backgroundColor: '#0dcaf080' }
      case 'DATABASE':
        return { label: 'Базы данных идеи', backgroundColor: '#ffc10780' }
      default:
        return { label: 'Девопс технологии идеи', backgroundColor: '#dc354580' }
    }
  }

  return {
    labels: skillsLabels,
    datasets: [
      {
        data: skillsValues,
        ...getOptionsBySkillType(type),
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  }
}

function getSkillsDataTeam(skills: Skill[], type: SkillType) {
  const skillsByType = skills.filter((skill) => skill.type === type)

  if (skillsByType.length === 0) {
    return undefined
  }

  const uniqueSkills = [
    ...new Map(skillsByType.map((skill) => [skill.id, skill])).values(),
  ]

  const skillsLabels = uniqueSkills.map((skill) => skill.name)
  const skillsValues: number[] = []

  uniqueSkills.forEach((currentSkill) => {
    const skillAmount = skillsByType.reduce(
      (amount, skill) => (skill.id === currentSkill.id ? (amount += 1) : amount),
      0,
    )

    skillsValues.push(skillAmount)
  })

  const getOptionsBySkillType = (type: SkillType) => {
    switch (type) {
      case 'LANGUAGE':
        return { label: 'Языки разработки команды', backgroundColor: '#0038FF80' }
      case 'FRAMEWORK':
        return { label: 'Фреймворки команды', backgroundColor: '#00FF6680' }
      case 'DATABASE':
        return { label: 'Базы данных команды', backgroundColor: '#AD00FF80' }
      default:
        return { label: 'Девопс технологии команды', backgroundColor: '#FFD60080' }
    }
  }

  return {
    labels: skillsLabels,
    datasets: [
      {
        data: skillsValues,
        ...getOptionsBySkillType(type),
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  }
}

function changeDatasetsData(data: SkillsRadarChartType, labels: string[]) {
  const newDatasetsData = ref<number[]>([])
  const currentDatasetsData = ref<number[]>([])

  newDatasetsData.value.length = labels.length

  data.datasets.forEach((elem) =>
    elem.data.forEach((el) => el && currentDatasetsData.value.push(el)),
  )

  for (let index = 0; index < labels.length; index++) {
    const label = labels[index]

    if (data.labels?.includes(labels[index])) {
      const indexData = data.labels.indexOf(label)
      if (currentDatasetsData.value[index]) {
        newDatasetsData.value.splice(index, 1, currentDatasetsData.value[index])
      } else
        newDatasetsData.value.splice(index, 1, currentDatasetsData.value[indexData])
    } else newDatasetsData.value.splice(index, 1, 0)
  }

  data.datasets[0].data = newDatasetsData.value

  return data.datasets
}

function getAllSkillsData(
  skills: SkillsRadarChartType,
  skillsTeam: SkillsRadarChartType,
) {
  const labelsSkillsIdea = ref<string[]>([])
  const labelsSkillsTeam = ref<string[]>([])

  if (skills?.labels) labelsSkillsIdea.value = skills.labels
  if (skillsTeam.labels) labelsSkillsTeam.value = skillsTeam.labels

  const arr = ref<string[]>([...labelsSkillsIdea.value, ...labelsSkillsTeam.value])
  const label = [...new Set(arr.value)]

  return {
    labels: label,
    datasets: [
      changeDatasetsData(skills, label)[0],
      changeDatasetsData(skillsTeam, label)[0],
    ],
  }
}

watchImmediate(
  () => props.skills,
  (currentSkills) => {
    console.log(currentSkills[1].skills)
    languageSkillsIdea.value = getSkillsData(currentSkills[0].skills, 'LANGUAGE')
    frameworkSkillsIdea.value = getSkillsData(currentSkills[0].skills, 'FRAMEWORK')
    databaseSkillsIdea.value = getSkillsData(currentSkills[0].skills, 'DATABASE')
    devopsSkillsIdea.value = getSkillsData(currentSkills[0].skills, 'DEVOPS')

    languageSkillsTeam.value = getSkillsDataTeam(currentSkills[1].skills, 'LANGUAGE')
    frameworkSkillsTeam.value = getSkillsDataTeam(
      currentSkills[1].skills,
      'FRAMEWORK',
    )
    databaseSkillsTeam.value = getSkillsDataTeam(currentSkills[1].skills, 'DATABASE')
    devopsSkillsTeam.value = getSkillsDataTeam(currentSkills[1].skills, 'DEVOPS')
  },
  { deep: true },
)

watchImmediate(
  () => props.skillsIdea,
  (currentSkills) => {
    if (currentSkills) {
      languageSkillsIdea.value = getSkillsData(currentSkills, 'LANGUAGE')
      frameworkSkillsIdea.value = getSkillsData(currentSkills, 'FRAMEWORK')
      databaseSkillsIdea.value = getSkillsData(currentSkills, 'DATABASE')
      devopsSkillsIdea.value = getSkillsData(currentSkills, 'DEVOPS')
    }
  },
)

watchImmediate(
  () => props.skillsTeam,
  (currentSkills) => {
    if (currentSkills) {
      languageSkillsTeam.value = getSkillsDataTeam(currentSkills, 'LANGUAGE')
      frameworkSkillsTeam.value = getSkillsDataTeam(currentSkills, 'FRAMEWORK')
      databaseSkillsTeam.value = getSkillsDataTeam(currentSkills, 'DATABASE')
      devopsSkillsTeam.value = getSkillsDataTeam(currentSkills, 'DEVOPS')
    }
  },
)

const intervalId = setInterval(() => {
  if (route.fullPath !== '/teams/create') {
    clearInterval(intervalId)
  }

  if (radarChartPlaceholder.value.includes('...')) {
    radarChartPlaceholder.value = 'Вычисление диаграм'
  } else {
    radarChartPlaceholder.value += '.'
  }
}, 200)
</script>

<template>
  <div :class="['radar-charts', ...ButtonClassName]">
    <div
      v-for="(skill, index) in allSkills"
      :key="index"
    >
      <RadarChart
        v-if="skill.data"
        :chart-data="skill.data"
        :height="300"
      />

      <div
        v-else
        class="radar-charts__placeholder-wrapper"
      >
        <div
          v-if="!isNotPlaceholder"
          class="radar-charts__placeholder placeholder-glow"
        >
          <div class="placeholder col-12 h-100 rounded" />
        </div>
      </div>
    </div>

    <Typography
      v-if="allSkills.every((skill) => skill.data === undefined)"
      class-name="w-100 text-center"
    >
      {{ radarChartPlaceholder }}
    </Typography>
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
