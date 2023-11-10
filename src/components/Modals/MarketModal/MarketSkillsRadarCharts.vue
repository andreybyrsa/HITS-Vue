<script lang="ts" setup>
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'
import { MarketSkillsradarChartsProps } from '@Components/Modals/MarketModal/MarketModal.types'

defineProps<MarketSkillsradarChartsProps>()
</script>

<template>
  <div class="bg-white rounded">
    <div
      class="market-skills-radar-charts w-100 bg-primary rounded-top fs-5 text-white p-2 mb-2"
    >
      Компетенции
    </div>
    <SkillsRadarCharts
      class-name="w-100"
      :skills="skills"
      :skills-team="skillsTeam"
    />
  </div>
</template>

<style lang="scss" scoped>
.market-skills-radar-charts {
  @include flexible(center, center);
}
</style>
