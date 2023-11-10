<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  TeamAccessionButtonsEmits,
  TeamAccessionButtonsProps,
} from '@Components/Modals/TeamAccessionModal/TeamAccessionModal.types'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits<TeamAccessionButtonsEmits>()

defineProps<TeamAccessionButtonsProps>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
</script>
<template>
  <div class="buttons">
    <template
      v-if="
        mode == 'read' &&
        teamRequest?.stage == 'REQUEST' &&
        (teamRequest.team.owner.userId == user?.id ||
          teamRequest.team.leader?.userId == user?.id) &&
        teamRequest.targetEmail != user?.email
      "
      ><Button
        class-name="rounded-end btn-success"
        @click="emit('responseToRequest', 'ACCEPTED')"
      >
        Одобрить
      </Button>
      <Button
        class-name="rounded-end btn-danger"
        @click="emit('responseToRequest', 'REJECTED')"
      >
        Отклонить
      </Button></template
    >
    <Button
      v-if="mode == 'write'"
      class-name="rounded-end btn-primary"
      @click="emit('sendRequest')"
    >
      Отправить заявку
    </Button>

    <Button
      v-if="
        mode == 'read' &&
        !teamRequest?.requestType &&
        teamRequest?.requestType == 'ENTER' &&
        user?.email != teamRequest.targetEmail
      "
      class-name="rounded-end btn-primary"
      @click="emit('invite')"
    >
      Отправить приглашение заново
    </Button>

    <template
      v-if="
        mode == 'read' &&
        teamRequest?.stage == 'INVITATION' &&
        user?.email == teamRequest.targetEmail
      "
      ><Button
        class-name="rounded-end btn-success"
        @click="emit('responseToInvitation', 'ACCEPTED')"
      >
        Принять
      </Button>
      <Button
        class-name="rounded-end btn-danger"
        @click="emit('responseToInvitation', 'REJECTED')"
      >
        Отклонить
      </Button></template
    >
  </div>
</template>
<style lang="scss" scoped>
.buttons {
  @include flexible(stretch, center, $gap: 16px);
}
</style>
