<script lang="ts" setup>
import ExchangeAcceptTeamProps from '@Components/Modals/ExchangeModal/ExchangeAcceptTeams.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

defineProps<ExchangeAcceptTeamProps>()
</script>

<template>
  <div class="exchange-info bg-white rounded w-100 p-3">
    <Typography class-name="border-bottom text-secondary d-block"
      >Принятые заявки</Typography
    >
    <Button
      v-for="team in teams"
      :key="team.id"
      class="btn-outline-primary exchange-info__button w-100"
    >
      <div>{{ team.name }}</div>
      <Icon class-name="bi bi-eye" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.exchange-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__button {
    @include flexible(center, space-between);
  }
}
</style>
