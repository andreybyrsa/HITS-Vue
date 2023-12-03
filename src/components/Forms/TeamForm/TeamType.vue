<script lang="ts" setup>
import { useField } from 'vee-validate'

import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'

const { value: teamIsClosed, errorMessage } = useField<boolean>(
  'closed',
  undefined,
  {
    validateOnMount: false,
    validateOnValueUpdate: true,
  },
)

function chooseTeamType(closed: boolean) {
  teamIsClosed.value = closed === true ? closed : false
}

function getTeamTypeClassName(closed: boolean) {
  return [
    'team-type w-50 p-2 rounded-3 border border-2',
    {
      'team-type--active border-primary border-opacity-75':
        closed === teamIsClosed.value,
    },
    {
      'teamt-type--error border-danger border-opacity-75': errorMessage.value,
    },
  ]
}
</script>

<template>
  <div class="w-100">
    <Typography class-name="text-primary">Тип команды*</Typography>

    <div class="my-2 d-flex gap-3">
      <div
        :class="getTeamTypeClassName(false)"
        @click="chooseTeamType(false)"
      >
        <div class="team-type__icon rounded-circle bg-success bg-opacity-25">
          <Icon class-name="fs-2 text-success bi bi-folder2-open" />
        </div>

        <div class="team-type__text">
          <Typography class-name="fs-4">Открытая</Typography>
          <Typography class-name="text-secondary">
            Любой пользователь системы может отправить заявку на присоединение в
            команду
          </Typography>
        </div>
      </div>

      <div
        :class="getTeamTypeClassName(true)"
        @click="chooseTeamType(true)"
      >
        <div class="team-type__icon rounded-circle bg-danger bg-opacity-25">
          <Icon class-name="fs-2 text-danger bi bi-shield-lock" />
        </div>

        <div class="team-type__text">
          <Typography class-name="fs-4">Закрытая</Typography>
          <Typography class-name="text-secondary">
            Пользователь портала может присоединиться в команду только по приглашению
          </Typography>
        </div>
      </div>
    </div>

    <Typography
      v-if="errorMessage"
      class-name="text-danger"
    >
      {{ errorMessage }}
    </Typography>
  </div>
</template>

<style lang="scss" scoped>
.team-type {
  cursor: pointer;

  transition: all $default-transition-settings;

  @include flexible(center, space-between, $gap: 8px);

  &--active {
    background-color: rgb(13, 110, 253, 0.08);
  }

  &--error {
    background-color: rgb(220, 53, 69, 0.08);
  }

  &__icon {
    min-width: 50px;
    height: 50px;

    @include flexible(center, center);
  }

  &__text {
    @include flexible(flex-start, flex-start, column);
  }
}
</style>
