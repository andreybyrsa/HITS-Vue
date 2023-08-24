<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { IdeaActionsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import actionsButton from './IdeaActionsButton'
import IdeaActionsType from './IdeaActions.types'

import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

const props = defineProps<IdeaActionsProps>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function checkUserRoleForButtons(button: IdeaActionsType) {
  const currentRole = user.value?.role
  return currentRole && button.roles.includes(currentRole)
}

function checkStatusIdea(button: IdeaActionsType) {
  const currentStatusIdea = props.idea?.status
  return currentStatusIdea && button.status.includes(currentStatusIdea)
}

function checkStatus() {
  return (user.value?.role == 'INITIATOR' &&
    (props.idea?.status == 'NEW' || props.idea?.status == 'ON_EDITING')) ||
    user.value?.role == 'ADMIN'
    ? false
    : true
}
</script>

<template>
  <div class="rounded-3 bg-white p-3">
    <div class="idea-actions">
      <template v-for="button in actionsButton">
        <Button
          :key="button.id"
          v-if="checkUserRoleForButtons(button)"
          type="submit"
          :disabled="!checkStatusIdea(button)"
          :class-name="button.class"
        >
          {{ button.text }}
        </Button>
      </template>
      <Button
        type="submit"
        v-if="user?.role == 'ADMIN' || user?.role == 'INITIATOR'"
        @click="router.push(`edit-idea/${props.idea?.id}`)"
        :disabled="checkStatus()"
        class-name="btn-light"
      >
        Редактировать
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-actions {
  @include flexible(center, flex-start, row, wrap, $gap: 16px);
}
</style>
