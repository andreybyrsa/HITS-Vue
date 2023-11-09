<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import ReviewIdeaRequestsFormProps from '@Components/Forms/ReviewIdeaRequestsForm/ReviewIdeaRequestsForm.types'

import useUserStore from '@Store/user/userStore'

import ReviewIdeaRequestTable from '@Components/Tables/ReviewIdeaRequestTable/ReviewIdeaRequestTable.vue'
import Typography from '@Components/Typography/Typography.vue'

import RequestTeams from '@Domain/RequestTeams'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<ReviewIdeaRequestsFormProps>()

const teams = defineModel<RequestTeams[]>({ required: true })

function filterTeamsAccepted(teams: RequestTeams[]) {
  return teams.filter((elem) => elem.accepted === false)
}
</script>

<template>
  <div
    v-if="user?.email == idea.initiator.email && filterTeamsAccepted(teams).length"
    class="review-request-form bg-white rounded-3"
  >
    <Typography class-name="fs-6 py-2 px-3 border-bottom w-100"
      >Заявившиеся команды
    </Typography>

    <ReviewIdeaRequestTable v-model="teams" />
  </div>
</template>

<style lang="scss" scoped>
.review-request-form {
  position: relative;
  @include flexible(flex-start, flex-start, column, $gap: 6px);
  width: 100%;
  height: 800px;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
