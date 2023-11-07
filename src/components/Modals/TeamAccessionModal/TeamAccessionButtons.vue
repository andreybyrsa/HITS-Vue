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
        (teamRequest.team.owner.id == user?.id ||
          teamRequest.team.leader?.id == user?.id)
      "
      ><Button
        class-name="rounded-end btn-success"
        @click="emit('response', 'ACCEPTED')"
      >
        Одобрить
      </Button>
      <Button
        class-name="rounded-end btn-danger"
        @click="emit('response', 'REJECTED')"
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
        teamRequest?.requestType == 'ENTER'
      "
      class-name="rounded-end btn-primary"
      @click="emit('invite')"
    >
      Отправить приглашение заново
    </Button>

    <template v-if="mode == 'read' && teamRequest?.stage == 'INVITATION'"
      ><Button
        class-name="rounded-end btn-success"
        @click="emit('response', 'ACCEPTED')"
      >
        Принять
      </Button>
      <Button
        class-name="rounded-end btn-danger"
        @click="emit('response', 'REJECTED')"
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
