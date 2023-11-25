<script lang="ts" setup>
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import { Team } from '@Domain/Team'
import { useDateFormat } from '@vueuse/core'

const team = defineModel<Team>({ required: true })

function getFormattedDate(date: string) {
  return useDateFormat(new Date(date), 'DD.MM.YYYY').value
}

function getProfileLink(id: string) {
  return `profile/${id}`
}
</script>

<template>
  <Typography class-name="p-2 bg-primary rounded-top fs-4 text-center text-white">
    Информация
  </Typography>

  <div class="team-main-stuff px-2">
    <div class="w-100">
      <Typography class-name="border-bottom text-secondary d-block">
        Дата создания
      </Typography>

      <div class="team-main-stuff__item pt-2 ps-1">
        <Icon class-name="bi bi-calendar-date text-secondary fs-3 opacity-25" />

        <Typography class-name="text-primary">
          {{ getFormattedDate(team.createdAt) }}
        </Typography>
      </div>
    </div>

    <div class="w-100">
      <Typography class-name="border-bottom text-secondary d-block">
        Владелец команды
      </Typography>

      <div class="team-main-stuff__item pt-2 ps-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25" />

        <router-link
          class="team-main-stuff__link"
          :to="getProfileLink(team.owner.id)"
        >
          <Typography class-name="text-dark">
            {{ team.owner.firstName + ' ' + team.owner.lastName }}
          </Typography>
        </router-link>
      </div>
    </div>

    <div
      v-if="team.leader"
      class="w-100"
    >
      <Typography class-name="border-bottom text-secondary d-block">
        Лидер команды
      </Typography>

      <div class="team-main-stuff__item pt-2 ps-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25" />

        <router-link
          class="team-main-stuff__link"
          :to="getProfileLink(team.leader.id)"
        >
          <Typography class-name="text-dark">
            {{ team.leader.firstName + ' ' + team.leader.lastName }}
          </Typography>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-main-stuff {
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__item {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
      text-decoration-color: $black-color;
    }
  }
}
</style>
