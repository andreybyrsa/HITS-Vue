<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import { TeamDescriptionEmits } from '@Components/Modals/TeamModal/TeamModal.types'
import TeamProjects from '@Components/Modals/TeamModal/TeamProjects.vue'
import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'

import Team from '@Domain/Team'

const team = defineModel<Team>({ required: true })

const emit = defineEmits<TeamDescriptionEmits>()
</script>
<template>
  <div class="header">
    <Button
      class-name="btn-primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('closeModal')"
    >
      Назад
    </Button>

    <Typography
      class-name="p-3 w-100 bg-white rounded-3 fs-6 text-primary text-nowrap overflow-x-scroll"
    >
      {{ team?.name }}
    </Typography>
  </div>
  <ul class="list-group rounded-3">
    <li class="list-group-item p-0 overflow-hidden">
      <div class="d-flex flex-column p-1">
        <Typography class-name="fs-2 text-primary w-100">
          Описание команды
        </Typography>
        <Typography class-name="px-1">
          {{ team.description }}
        </Typography>
      </div>

      <TeamMembers v-model="team" />
      <TeamProjects v-model="team" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
.field {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;
  @include flexible(stretch, flex-start, $gap: 16px);
}

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
