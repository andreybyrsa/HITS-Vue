<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import actionsButton from '@Components/Modals/IdeaModal/IdeaActionsButton'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import ButtonSendIdeaOnApproval from './ButtonSendIdeaOnApproval.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<{ idea: Idea }>()
const router = useRouter()

function getAccessToConfirmation() {
  if (props.idea && user.value) {
    const { email } = user.value
    return !props.idea.confirmedBy?.includes(email)
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
  <div
    v-if="checkStatusAndRole()"
    class="rounded-3 bg-white p-3"
  >
    <div class="idea-actions">
      <ExpertRatingCalculator
        v-if="user?.role == 'EXPERT' && getAccessToConfirmation()"
        :idea="idea"
      />

      <div class="d-flex gap-3">
        <ButtonSendIdeaOnApproval :idea="idea" />
        <Button
          type="submit"
          v-if="
            user?.role == 'ADMIN' ||
            (user?.role == 'INITIATOR' && user.email == idea.initiator)
          "
          @click="router.push(`edit-idea/${props.idea?.id}`)"
          class-name="btn-light"
        >
          Редактировать
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-actions {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
