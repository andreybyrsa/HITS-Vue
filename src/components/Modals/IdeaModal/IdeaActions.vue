<script lang="ts" setup>
import { Idea } from '@Domain/Idea'

import Button from '@Components/Button/Button.vue'
import useUserStore from '@Store/user/userStore'
import CombinedRatingCalculator from '@Components/Modals/IdeaModal/CombinedRatingCalculator.vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import actionsButton from './IdeaActionsButton'
import IdeaActionsType from './IdeaActions.types'

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
  if (currentRole == 'ADMIN') {
    return true
  } else
    return (
      currentRole &&
      currentStatusIdea &&
      actionsButton.find(
        (e) =>
          currentRole &&
          currentStatusIdea &&
          e.roles.includes(currentRole) &&
          e.status.includes(currentStatusIdea),
      )
    )
}
</script>

<template>
  <div
    class="rounded-3 bg-white p-3"
    v-if="checkStatusAndRole()"
  >
    <div class="idea-actions">
      <CombinedRatingCalculator
        v-if="user?.role == 'EXPERT'"
        :idea="props.idea"
      />

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
          v-if="user?.role == 'ADMIN' || user?.role == 'INITIATOR'"
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
