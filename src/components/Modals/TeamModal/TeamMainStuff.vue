<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Team from '@Domain/Team'
import { useDateFormat } from '@vueuse/core'

const team = defineModel<Team>({ required: true })

function getFormattedDate(date: string) {
  return useDateFormat(new Date(date), 'DD.MM.YYYY').value
}
</script>
<template>
  <Typography class-name="text-primary text-nowrap team-modal__single-field"
    >Дата создания: {{ getFormattedDate(team.createdAt) }}
  </Typography>

  <Typography class-name="text-primary text-nowrap team-modal__single-field"
    >Владелец команды:
    <router-link
      class="nav-route list-group-item list-group-item-light"
      active-class="active"
      :to="'profile/' + team?.owner.id"
    >
      <Typography class="text-primary">{{
        team.owner.firstName + ' ' + team.owner.lastName
      }}</Typography>
    </router-link>
  </Typography>

  <Typography
    v-if="team.leader"
    class-name="text-primary text-nowrap team-modal__single-field"
    >Лидер команды:
    <router-link
      class="nav-route list-group-item list-group-item-light"
      active-class="active"
      :to="'profile/' + team.leader.id"
    >
      <Typography class="text-primary">{{
        team.leader.firstName + ' ' + team.leader.lastName
      }}</Typography>
    </router-link>
  </Typography>
</template>
