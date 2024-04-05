<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { Team } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'
import LaunchQuestsTable from '@Components/Tables/LaunchQuestsTable/LaunchQuestsTable.vue'

const teamStore = useTeamStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const teams = ref<Team[]>()
</script>

<template>
  <LaunchQuestsTable />

  <router-view />
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
