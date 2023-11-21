<script lang="ts" setup>
import { Team } from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

const team = defineModel<Team>({ required: true })

function getMemberButtonClassName(member: TeamMember) {
  const buttonClassName = [
    'd-flex',
    'justify-content-start',
    'field',
    'list-group-item',
    'list-group-item-light',
    'w-100',
  ]
  if (member.id == team.value.leader?.id) {
    buttonClassName.push('text-danger')
    return buttonClassName.join(' ')
  }
  buttonClassName.push('text-primary')
  return buttonClassName.join(' ')
}
</script>

<template>
  <Typography class-name="p-2 fs-2 text-primary w-100">
    Участники команды
  </Typography>
  <div class="content overflow-y-scroll">
    <template v-if="team.membersCount > 0">
      <template
        v-for="member in team.members"
        :key="member.email"
      >
        <Button
          :class-name="getMemberButtonClassName(member)"
          prepend-icon-name="bi bi-person"
        >
          {{ member.firstName + ' ' + member.lastName }}
        </Button>
      </template>
    </template>
    <div
      v-else
      class="p-4 d-flex flex-column"
    >
      <Typography class-name="py-3 d-flex justify-content-center">
        Здесь пока нет участников
      </Typography>
      <Icon class-name="bi bi-emoji-frown fs-1"></Icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-member {
  @include flexible(flex-start, space-between, $gap: 16px);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(stretch, flex-start, $gap: 16px);
}

.content {
  max-height: 600px;
}
</style>
