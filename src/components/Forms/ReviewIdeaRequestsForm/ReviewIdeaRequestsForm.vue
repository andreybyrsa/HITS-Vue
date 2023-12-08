<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { ReviewIdeaRequestsFormProps } from '@Components/Forms/ReviewIdeaRequestsForm/ReviewIdeaRequestsForm.types'

import useUserStore from '@Store/user/userStore'

import ReviewIdeaRequestTable from '@Components/Tables/ReviewIdeaRequestTable/ReviewIdeaRequestTable.vue'
import Typography from '@Components/Typography/Typography.vue'

import { RequestTeams } from '@Domain/RequestTeamToIdea'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<ReviewIdeaRequestsFormProps>()

const teams = defineModel<RequestTeams[]>('requestTeams', { required: true })
const skillsRequestTeam = defineModel<RequestTeams[]>('skillsRequestTeam')

function filterTeamsAccepted(teams: RequestTeams[]) {
  return teams.filter((elem) => elem.status === 'ACCEPTED')
}
</script>

<template>
  <div
    v-if="user?.email == idea.initiator.email && filterTeamsAccepted(teams).length"
    class="review-request-form bg-white rounded-3"
  >
    <Typography class-name="fs-6 py-2 px-3 border-bottom w-100">
      Заявившиеся команды
    </Typography>

    <div class="review-request-form__table">
      <ReviewIdeaRequestTable
        v-model:teams="teams"
        v-model:skillsRequestTeam="skillsRequestTeam"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.review-request-form {
  position: relative;

  width: 100%;
  height: 800px;

  @include flexible(flex-start, flex-start, column, $gap: 6px);

  &__table {
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
