<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import IdeaActionsType from '@Components/Modals/IdeaModal/IdeaActions.types'
import { Idea } from '@Domain/Idea'

import useIdeasStore from '@Store/ideas/ideasStore'
import useUserStore from '@Store/user/userStore'
import IdeasService from '@Services/IdeasService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

import Button from '@Components/Button/Button.vue'
import actionsButton from '@Components/Modals/IdeaModal/IdeaActionsButton'

defineProps<{ idea: Idea }>()

function checkUserRoleForButtons(button: IdeaActionsType) {
  const currentRole = user.value?.role
  return currentRole && button.roles.includes(currentRole)
}

function hundleSendIdea(idea: Idea, text: string) {
  const userToken = user.value?.token
  if (userToken) {
    if (text == 'Отправить на согласование') {
      return ideaStore.sendInitiatorIdeaOnApproval(idea.id, userToken)
    }
    if (text == 'Отправить на утверждение') {
      idea.status = 'ON_CONFIRMATION'
      return IdeasService.putAdminIdea(idea, idea.id, userToken)
      // return IdeasService.changeStatusIdeaByProjectOffice(
      //   idea.id,
      //   'ON_CONFIRMATION',
      //   userToken,
      // )
    }
    if (text == 'Отправить на доработку') {
      idea.status = 'ON_EDITING'
      return IdeasService.putAdminIdea(idea, idea.id, userToken)
    }
  }
}
</script>

<template>
  <template v-for="button in actionsButton">
    <Button
      :key="button.id"
      v-if="checkUserRoleForButtons(button)"
      type="submit"
      :class-name="button.class"
      @click="hundleSendIdea(idea, button.text)"
    >
      {{ button.text }}
    </Button>
  </template>
</template>
