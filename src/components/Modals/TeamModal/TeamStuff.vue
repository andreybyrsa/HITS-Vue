<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import TeamStuffProps from './TeamStuff.types'

defineProps<TeamStuffProps>()
</script>
<template>
  <Typography class-name="text-primary text-nowrap team-modal__single-field"
    >Владелец команды:
    <router-link
      class="nav-route list-group-item list-group-item-light"
      active-class="active"
      :to="'profile/' + team?.owner.email"
    >
      <Typography class="text-primary">{{
        team.owner.firstName + ' ' + team.owner.lastName
      }}</Typography>
    </router-link>
  </Typography>

  <Typography class-name="text-primary text-nowrap team-modal__single-field"
    >Лидер команды:
    <router-link
      class="nav-route list-group-item list-group-item-light"
      active-class="active"
      :to="'profile/' + team.leader.email"
    >
      <Typography class="text-primary">{{
        team.leader.firstName + ' ' + team.leader.lastName
      }}</Typography>
    </router-link>
  </Typography>
</template>
