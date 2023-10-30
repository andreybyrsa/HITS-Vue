<script lang="ts" setup>
import { ref, watch } from 'vue'

import TeamCollapseProps from '@Components/TeamCollapse/TeamCollapse.types'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'

import Team from '@Domain/Team'

defineProps<TeamCollapseProps>()

const currentTeam = defineModel<Team>('currentTeam')

const selectTeams = ref<Team>()

watch(selectTeams, (value) => {
  if (value) {
    selectTeams.value = value
    currentTeam.value = value
  }
})
</script>

<template>
  <div class="team-collapse w-100">
    <div
      class="border rounded-3 p-0 overflow-hidden w-100"
      :class="`${selectTeams == team ? 'border-success' : ''}`"
      v-for="team in teams"
      :key="team.id"
    >
      <div class="team-collapse__button">
        <div class="p-2">
          <Radio
            validateOnUpdate
            name="team"
            :value="team"
            v-model="selectTeams"
          />
        </div>
        <Button
          class-name="team-collapse__button-name btn-light bi w-100"
          v-collapse="team.id"
        >
          {{ team.name }}
          <i class="'bi bi-caret-down" />
        </Button>
      </div>

      <Collapse :id="team.id">
        <div class="w-100 d-flex p-2">
          <div class="w-50">
            <div class="text-primary pb-1">Состав:</div>
            <div class="d-flex flex-wrap gap-2">
              <div
                class="p-1 rounded bg-light border"
                v-for="member in team.members"
                :key="member.id"
              >
                {{ member.email }}
              </div>
            </div>
          </div>
          <div class="w-50 border-start ps-3 pb-1">
            <div class="text-primary pb-1">Компетенции:</div>
            <div class="d-flex flex-wrap gap-2">
              <div
                class="p-1 rounded bg-light border"
                v-for="skill in team.skills"
                :key="skill.id"
              >
                {{ skill.name }}
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-collapse {
  @include flexible(flex-start, flex-start, column, $gap: 8px);

  &__button {
    @include flexible(center, flex-start);

    &-name {
      border-radius: 0;
      background-color: $white-color;

      color: $primary-color;

      @include flexible(center, space-between);
    }
  }
}
</style>
