<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import useTeamStore from '@Store/teams/teamsStore'

import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

import Skills from '@Components/Skills/Skills.vue'
import { TeamMemberInfoProps } from '@Components/Modals/TeamModal/TeamModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

const team = defineModel<Team>({ required: true })

const props = defineProps<TeamMemberInfoProps>()

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const router = useRouter()

const teamStore = useTeamStore()

const { user } = storeToRefs(userStore)

const handleKick = async (member: TeamMember, teamId: string) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    await teamStore.kickMember(member, teamId, token)
  }
}

function navigateToProfile(id: string) {
  router.push(`profile/${id}`)
}
</script>
<template>
  <div class="member-info">
    <div
      v-if="member.skills.length > 0"
      class="d-flex flex-column"
    >
      <Typography class-name="">Компетенции:</Typography>
      <Skills :skills="member.skills" />
    </div>
    <div class="member-info__buttons">
      <Button
        class-name="btn-primary my-2"
        @click="navigateToProfile(member.userId)"
        >Перейти в профиль</Button
      >
      <Button
        v-if="user?.id == team.owner.userId && user.id != member.userId"
        class-name="btn-danger"
        @click="handleKick(member, team.id)"
        >Кикнуть</Button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.member-info {
  @include flexible(flex-start, space-between, $gap: 16px);

  &__buttons {
    @include flexible(center, flex-start, $gap: 16px);
  }
}
</style>
