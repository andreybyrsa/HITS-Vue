<script lang="ts" setup>
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import TeamMemberInfo from '@Components/Modals/TeamModal/TeamMemberInfo.vue'

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
    <template v-if="team.membersCount > 0">
      <template
        v-for="member in team.members"
        :key="member.email"
      >
        <Button
          :class-name="getMemberButtonClassName(member)"
          prepend-icon-name="bi bi-person"
          v-collapse="member.id"
        >
          {{ member.firstName + ' ' + member.lastName }}
        </Button>
        <Collapse
          class-name="p-3"
          :id="member.id.toString()"
          ><TeamMemberInfo
            :member="member"
            v-model="team"
        /></Collapse>
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
  </Collapse>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(stretch, flex-start, $gap: 16px);
}

.collapse-content {
  max-height: 600px;
}
</style>
