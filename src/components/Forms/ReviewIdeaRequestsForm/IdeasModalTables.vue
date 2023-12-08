<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { RequestsToIdeaProps } from '@Components/Forms/ReviewIdeaRequestsForm/ReviewIdeaRequestsForm.types'

import useUserStore from '@Store/user/userStore'

import ReviewIdeaRequestTable from './ReviewIdeaRequestTable.vue'
import RequestToIdea from './RequestToIdea.vue'

const props = defineProps<RequestsToIdeaProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isIdeaInvitationsTable = ref(false)
const isRequestsToIdeaTable = ref(false)

function switchToIdeaInvitationsTable() {
  isIdeaInvitationsTable.value = true
  isRequestsToIdeaTable.value = false
}

function switchToRequestsToIdeaTable() {
  isRequestsToIdeaTable.value = true
  isIdeaInvitationsTable.value = false
}

function getNavLinkStyle(isCurrentTable: boolean) {
  return [
    'nav-link',
    'fw-normal',
    'pb-1',
    { 'active text-primary': isCurrentTable },
    { 'text-secondary': !isCurrentTable },
  ]
}

function getTeamInvitations() {
  const currentUser = user.value
  const { owner } = props.team

  return currentUser?.id === owner.id
}

function getRequestsToIdea() {
  const currentUser = user.value
  const { owner } = props.team

  return !props.team.closed && currentUser?.id === owner.id
}
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="border-bottom px-3">
      <ul class="nav nav-underline">
        <div
          v-if="getTeamInvitations()"
          :class="getNavLinkStyle(isIdeaInvitationsTable)"
          @click="switchToIdeaInvitationsTable"
        >
          Приглашения
        </div>
        <div
          v-if="getRequestsToIdea()"
          :class="getNavLinkStyle(isRequestsToIdeaTable)"
          @click="switchToRequestsToIdeaTable"
        >
          Заявки
        </div>
      </ul>
    </div>

    <div class="team-tables px-3 pb-3 pt-1">
      <ReviewIdeaRequestTable :teams="requests" />

      <RequestToIdea
        v-if="isRequestsToIdeaTable && requests"
        :requests="requests"
        :team="team"
        :teams="requests"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team-tables {
  max-height: 430px;
}
.nav-link {
  cursor: pointer;
}
</style>
