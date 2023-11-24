<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import { TeamDescriptionEmits } from '@Components/Modals/TeamModal/TeamModal.types'
import TeamProjects from '@Components/Modals/TeamModal/TeamProjects.vue'
import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'
import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { SkillsForRadar } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

import { Team } from '@Domain/Team'

const team = defineModel<Team>({ required: true })

const emit = defineEmits<TeamDescriptionEmits>()

const radarChartsSkills = ref<SkillsForRadar[]>([
  { label: 'Фактические компетенции', skills: team.value.skills, alphaOpacity: 200 },
  {
    label: 'Желаемые компетенции',
    skills: team.value.wantedSkills,
    alphaOpacity: 50,
  },
])

onMounted(() => {
  setTimeout(() => {
    radarChartsSkills.value = [
      {
        label: 'Желаемые компетенции',
        skills: team.value.wantedSkills,
        alphaOpacity: 50,
      },
    ]
  }, 2000)
})
</script>

<template>
  <div class="header">
    <Button
      class-name="btn-primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('closeModal')"
    >
      Назад
    </Button>

    <Typography
      class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-x-scroll"
    >
      {{ team?.name }}
    </Typography>
  </div>

  <div class="bg-white rounded-3">
    <div class="p-2 border-bottom">
      <Typography class-name="text-primary">Описание команды</Typography>
    </div>
    <div class="p-2">
      <Typography>{{ team.description }}</Typography>
    </div>

    <TeamMembers v-model="team" />
    <TeamProjects v-model="team" />
  </div>

  <div class="bg-white rounded-3">
    <div class="p-2 border-bottom">
      <Typography class-name="text-primary">Компетенции команды</Typography>
    </div>

    <div class="p-2">
      <SkillsRadarChart :skills="[...radarChartsSkills]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
.field {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;
  @include flexible(stretch, flex-start, $gap: 16px);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(stretch, flex-start, $gap: 16px);
}

.collapse-content {
  max-height: 600px;
}
</style>
