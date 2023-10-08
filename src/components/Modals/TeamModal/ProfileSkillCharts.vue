<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'
import { RadarChart } from 'vue-chart-3'
import { Chart, registerables, ChartData } from 'chart.js'

import {
  ProfileSkillChartsProps,
  ProfileSkillChartsEmits,
} from '@Components/Modals/TeamModal/TeamModal.types'
import Typography from '@Components/Typography/Typography.vue'

import { Skill, SkillType } from '@Domain/Skill'

Chart.register(...registerables)

const props = defineProps<ProfileSkillChartsProps>()
const emit = defineEmits<ProfileSkillChartsEmits>()
const route = useRoute()

type SkillsRadarChartType = ChartData<'radar', (number | null)[], string>

const languageSkills = ref<SkillsRadarChartType>()
const frameworkSkills = ref<SkillsRadarChartType>()
const databaseSkills = ref<SkillsRadarChartType>()
const devopsSkills = ref<SkillsRadarChartType>()

const allSkills = ref<Skill[]>([])

const radarChartPlaceholder = ref('Вычисление диаграм')

const skillsData = computed(() => [
  { data: languageSkills.value },
  { data: frameworkSkills.value },
  { data: databaseSkills.value },
  { data: devopsSkills.value },
])

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
        return { label: 'Языки разработки', backgroundColor: '#19865380' }
      case 'FRAMEWORK':
        return { label: 'Фреймворки', backgroundColor: '#0dcaf080' }
      case 'DATABASE':
        return { label: 'Базы данных', backgroundColor: '#ffc10780' }
      default:
        return { label: 'Девопс технологии', backgroundColor: '#dc354580' }
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

watchImmediate(
  () => props.team.members,
  (members) => {
    members.forEach((member) => allSkills.value.push(...member.skills))
    languageSkills.value = getSkillsData(allSkills.value, 'LANGUAGE')
    frameworkSkills.value = getSkillsData(allSkills.value, 'FRAMEWORK')
    databaseSkills.value = getSkillsData(allSkills.value, 'DATABASE')
    devopsSkills.value = getSkillsData(allSkills.value, 'DEVOPS')
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
  <div class="radar-charts w-100">
    <div
      v-for="(skills, index) in skillsData"
      :key="index"
      class="radar-charts__chart w-50"
    >
      <RadarChart
        v-if="skills.data"
        :chart-data="skills.data"
        :height="300"
      />

      <div
        v-else
        class="radar-charts__placeholder-wrapper"
      >
        <div class="radar-charts__placeholder placeholder-glow">
          <div class="placeholder col-12 h-100"></div>
        </div>
      </div>
    </div>

    <Typography
      v-if="skillsData.every((skill) => skill.data === undefined)"
      class-name="w-100 text-center"
    >
      {{ radarChartPlaceholder }}
    </Typography>
  </div>
</template>

<style lang="scss" scoped>
.radar-charts {
  @include flexible(flex-start, flex-start, $flex-wrap: wrap);

  &__chart {
    @include flexible(center, center);
  }

  &__placeholder {
    margin-top: 26px;

    width: 100px;
    height: 100px;

    transform: rotate(45deg);

    &-wrapper {
      height: 150px;

      @include flexible(center, center, column, $gap: 20px);
    }
  }
}
</style>
