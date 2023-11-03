<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import ReviewIdeaRequestsFormProps from '@Components/Forms/ReviewIdeaRequestsForm/ReviewIdeaRequestsForm.types'

import useUserStore from '@Store/user/userStore'

import ReviewIdeaRequestTable from '@Components/Tables/ReviewIdeaRequestTable/ReviewIdeaRequestTable.vue'

import RequestTeams from '@Domain/RequestTeams'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<ReviewIdeaRequestsFormProps>()

const teams = defineModel<RequestTeams[]>({ required: true })
</script>

<template>
  <div
    v-if="user?.email == idea.initiator"
    class="review-request-form bg-white px-3 py-1 rounded-3"
  >
    <ReviewIdeaRequestTable v-model="teams" />
  </div>
</template>

<style lang="scss" scoped>
.review-request-form {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
  width: 100%;
}
</style>
