<script lang="ts" setup>
import { ref } from 'vue'

import { IdeaMarketRightSideProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import IdeaMarketSkills from '@Components/Modals/IdeaMarketModal/IdeaMarketSkills.vue'
import IdeaMarketInfo from '@Components/Modals/IdeaMarketModal/IdeaMarketInfo.vue'
import Button from '@Components/Button/Button.vue'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

const props = defineProps<IdeaMarketRightSideProps>()

const skillsRequestTeam = defineModel<RequestTeamToIdea[]>('skillsRequestTeam')
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

const isChangeContent = ref<boolean>(false)

function openMarketSkillsRadarCharts() {
  isChangeContent.value = true
}
function openMarketInfo() {
  isChangeContent.value = false
}
</script>

<template>
  <div class="right-side w-100">
    <div class="right-side__header w-100 p-2 bg-white rounded">
      <Button
        :class-name="!isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
        @click="openMarketInfo"
      >
        Информация
      </Button>
      <Button
        :class-name="isChangeContent ? 'btn-primary w-100' : 'btn-secondary w-100'"
        @click="openMarketSkillsRadarCharts"
      >
        Компетенции
      </Button>
    </div>

    <div v-if="isChangeContent">
      <IdeaMarketSkills
        :skills="skills"
        v-model:skillsRequestTeam="skillsRequestTeam"
        v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        :idea="idea"
      />
    </div>

    <IdeaMarketInfo
      v-else
      :idea-market="idea"
      :market="props.market"
    />
  </div>
</template>

<style lang="scss" scoped>
.right-side {
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__header {
    @include flexible(flex-start, space-between, $gap: 8px);
  }
}
</style>
