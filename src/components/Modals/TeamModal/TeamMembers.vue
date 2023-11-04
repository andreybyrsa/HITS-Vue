<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import TeamMember from '@Domain/TeamMember'
import Team from '@Domain/Team'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

const team = defineModel<Team>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const handleKick = async (member: TeamMember, teamId: number) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.kickMember(member, teamId, token)

    if (response instanceof Error) {
      return
    }
  }
}
</script>

<template>
  <Button
    class-name="collapse-controller fs-4 btn-light w-100"
    v-collapse="'teamMembers' + team.id"
  >
    Участники команды
  </Button>
  <Collapse
    class-name="collapse-content overflow-y-scroll"
    :id="'teamMembers' + team.id"
  >
    <router-link
      v-for="member in team.members"
      :key="member.email"
      class="field nav-route list-group-item list-group-item-light"
      active-class="active"
      :to="'profile/' + member.id"
    >
      <Icon class-name="bi bi-person" />
      <Typography class="text-dark">{{
        member.firstName + ' ' + member.lastName
      }}</Typography>
      <Icon
        v-if="user?.email == team?.owner.email"
        class-name="bi bi-person-dash text-danger"
        @click="handleKick(member, team.id)"
      />
    </router-link>
  </Collapse>
</template>
