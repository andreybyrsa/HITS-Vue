<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  TeamAccessionButtonsEmits,
  TeamAccessionButtonsProps,
} from '@Components/Modals/TeamAccessionModal/TeamAccessionModal.types'

import { accessionStage } from '@Domain/TeamAccession'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const emit = defineEmits<TeamAccessionButtonsEmits>()

const isLoading = ref<boolean>(false)

defineProps<TeamAccessionButtonsProps>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

function responseToRequest(accessionStage: accessionStage) {
  isLoading.value = true
  emit('responseToRequest', accessionStage)
  isLoading.value = false
}

function sendRequest() {
  isLoading.value = true
  emit('sendRequest')
  isLoading.value = false
}

function invite() {
  isLoading.value = true
  emit('invite')
  isLoading.value = false
}

function responseToInvitation(accessionStage: accessionStage) {
  isLoading.value = true
  emit('responseToInvitation', accessionStage)
  isLoading.value = false
}
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
        variant="success"
        :isLoading="isLoading"
        @click="responseToRequest('ACCEPTED')"
      >
        Одобрить
      </Button>
      <Button
        variant="danger"
        :isLoading="isLoading"
        @click="responseToRequest('REJECTED')"
      >
        Отклонить
      </Button></template
    >
    <Button
      v-if="mode == 'write'"
      variant="primary"
      :isLoading="isLoading"
      @click="sendRequest()"
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
      variant="primary"
      :isLoading="isLoading"
      @click="invite()"
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
        variant="success"
        :isLoading="isLoading"
        @click="responseToInvitation('ACCEPTED')"
      >
        Принять
      </Button>
      <Button
        variant="danger"
        :isLoading="isLoading"
        @click="responseToInvitation('REJECTED')"
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
