<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import ExpertRatingCalculator from '@Components/Modals/IdeaModal/ExpertRatingCalculator.vue'
import actionsButton from '@Components/Modals/IdeaModal/IdeaActionsButton'
import IdeaActionsType from '@Components/Modals/IdeaModal/IdeaActions.types'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<{ idea: Idea }>()
const router = useRouter()

function checkUserRoleForButtons(button: IdeaActionsType) {
  const currentRole = user.value?.role
  return currentRole && button.roles.includes(currentRole)
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
      actionsButton.find((e) =>
        currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
          ? true
          : currentRole == 'INITIATOR'
          ? currentInitiatorIdea == user.value?.email &&
            e.roles.includes(currentRole) &&
            e.status.includes(currentStatusIdea)
          : e.roles.includes(currentRole) && e.status.includes(currentStatusIdea),
      )
    )
}
</script>

<template>
  <div class="rounded-3 bg-white p-3">
    <div
      class="idea-actions"
      v-if="checkStatusAndRole()"
    >
      <ExpertRatingCalculator v-if="user?.role == 'EXPERT'" />

      <div class="d-flex gap-3">
        <template v-for="button in actionsButton">
          <Button
            :key="button.id"
            v-if="checkUserRoleForButtons(button)"
            type="submit"
            :class-name="button.class"
          >
            {{ button.text }}
          </Button>
        </template>
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
