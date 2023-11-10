<script lang="ts" setup>
import { MarketAcceptTeamProps } from '@Components/Modals/MarketModal/MarketModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import RequestTeams from '@Domain/RequestTeams'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import RequestTeamsServise from '@Services/RequestTeamsServise'

defineProps<MarketAcceptTeamProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teams = defineModel<RequestTeams[]>({ required: true })

function filterTeams(teams: RequestTeams[]) {
  return teams.filter((team) => team.accepted == true)
}

async function deleteRequestTeams(team: RequestTeams) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await RequestTeamsServise.putRequestTeams(
      { ...team, accepted: false },
      token,
    )

    if (response instanceof Error) {
      return
    }

    teams.value.filter((elem) =>
      elem.teamId == team.id ? (elem.accepted = false) : null,
    )
  }
}
</script>

<template>
  <div class="market-info bg-white rounded w-100 p-3">
    <Typography class-name="border-bottom text-secondary d-block">
      Принятые заявки
    </Typography>
    <div
      v-for="team in filterTeams(teams)"
      :key="team.id"
      class="d-flex gap-2"
    >
      <Button class="market-info__button btn-outline-primary w-100">
        <div class="market-info__button-name">{{ team.name }}</div>
        <Icon class-name="bi bi-eye" />
      </Button>
      <Button
        v-if="user?.email == idea?.initiator.email"
        class="btn-outline-danger"
        append-icon-name="bi bi-x"
        @click="deleteRequestTeams(team)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.market-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__button {
    @include flexible(center, space-between);
    overflow: hidden;

    &-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
