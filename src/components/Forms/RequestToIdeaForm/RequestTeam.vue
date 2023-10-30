<script lang="ts" setup>
import { RequestTeamProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Typography from '@Components/Typography/Typography.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import TeamCollapse from '@Components/TeamCollapse/TeamCollapse.vue'

import Team from '@Domain/Team'

defineProps<RequestTeamProps>()

const currentTeam = defineModel<Team>('selectTeam')
const letter = defineModel<string>('letter')
</script>

<template>
  <TeamCollapse
    v-if="teams.length"
    :teams="teams"
    v-model:currentTeam="currentTeam"
  />
  <Typography
    v-else
    class-name="fs-6 text-danger w-100"
  >
    *Только владелец команды может подать заявку
  </Typography>

  <Typography class-name="border-bottom fs-6 text-secondary w-100">
    Мотивационное письмо
  </Typography>

  <Textarea
    class-name="letter w-100 rounded-end"
    name="letter"
    validate-on-update
    v-model="letter"
  />
</template>

<style lang="scss">
.letter {
  resize: none;
  height: 200px;
}
</style>
