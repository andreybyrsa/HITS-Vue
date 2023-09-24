<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import actionsButton from '@Components/Modals/IdeaModal/IdeaActionsButton'
import ButtonSendIdeaOnApproval from '@Components/Modals/IdeaModal/ButtonSendIdeaOnApproval.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<{ idea: Idea }>()
const router = useRouter()

function getAccessToEditing() {
  if (user.value && props.idea) {
    const { email, role } = user.value
    const { status, initiator } = props.idea

    if (role === 'ADMIN') return true

    if (status === 'NEW' || status === 'ON_EDITING') {
      return role === 'INITIATOR' && email === initiator
    }
  }
  return false
}

function getAccessToApproval() {
  if (user.value && props.idea) {
    const { role } = user.value
    const { status } = props.idea

    if (status === 'ON_APPROVAL') {
      if (role === 'ADMIN') return true

      return role === 'PROJECT_OFFICE'
    }
  }
}

function getAccessToConfirmation() {
  if (user.value && props.idea) {
    const { email, role } = user.value
    const { status } = props.idea

    if (status === 'ON_CONFIRMATION') {
      if (role === 'ADMIN') return true

      return role === 'EXPERT' && !props.idea.confirmedBy?.includes(email)
    }
  }
  return false
}

function checkStatusAndRole() {
  const currentRole = user.value?.role
  const currentStatusIdea = props.idea?.status
  const currentInitiatorIdea = props.idea.initiator
  if (currentRole == 'ADMIN') {
    return true
  } else
    return (
      currentRole &&
      currentStatusIdea &&
      actionsButton.find((button) =>
        currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
          ? true
          : currentRole == 'INITIATOR'
          ? currentInitiatorIdea == user.value?.email &&
            button.roles.includes(currentRole) &&
            button.status.includes(currentStatusIdea)
          : button.roles.includes(currentRole) &&
            button.status.includes(currentStatusIdea),
      )
    )
}
</script>

<template>
  <ExpertRatingCalculator
    v-if="getAccessToConfirmation()"
    :idea="idea"
  />

  <div
    v-if="getAccessToEditing() || getAccessToApproval()"
    class="rounded-3 bg-white p-3 d-flex gap-3"
  >
    <ButtonSendIdeaOnApproval :idea="idea" />
    <Button
      v-if="getAccessToEditing()"
      class-name="btn-light"
      @click="router.push(`edit-idea/${props.idea?.id}`)"
    >
      Редактировать
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.idea-actions {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
