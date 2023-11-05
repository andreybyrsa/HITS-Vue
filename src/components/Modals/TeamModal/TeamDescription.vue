<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'
import Typography from '@Components/Typography/Typography.vue'
import { TeamDescriptionEmits } from '@Components/Modals/TeamModal/TeamModal.types'
import TeamProjects from '@Components/Modals/TeamModal/TeamProjects.vue'
import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'

import { Skill } from '@Domain/Skill'

import Team from '@Domain/Team'

const team = defineModel<Team>({ required: true })

const emit = defineEmits<TeamDescriptionEmits>()

const radarChartsSkills = ref<Skill[]>([])

onMounted(() => {
  const membersSkills: Skill[] = []

  team.value.members.forEach((member) => membersSkills.push(...member.skills))

  radarChartsSkills.value = membersSkills
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
      class-name="p-3 w-100 bg-white rounded-3 fs-6 text-primary text-nowrap overflow-x-scroll"
    >
      {{ team?.name }}
    </Typography>
  </div>
  <ul class="list-group rounded-3">
    <li class="list-group-item p-0 overflow-hidden">
      <Button
        class-name="fs-4 collapse-controller btn-light w-100"
        v-collapse="'teamDescription' + team.id"
      >
        Описание команды
      </Button>
      <Collapse :id="'teamDescription' + team.id">
        <div class="px-3">
          {{ team.description }}
        </div>
      </Collapse>

      <TeamMembers v-model="team" />
      <TeamProjects v-model="team" />
    </li>
  </ul>
  <div
    v-if="team.membersCount != 0 && radarChartsSkills.length != 0"
    class="w-100 p-3 bg-white rounded-3 text-primary text-nowrap overflow-y-scroll"
  >
    <Typography class="fs-4 py-2 d-flex justify-content-center"
      >Наши компетенции</Typography
    >
    <SkillsRadarCharts
      class-name="w-100"
      :skills="radarChartsSkills"
    />
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
