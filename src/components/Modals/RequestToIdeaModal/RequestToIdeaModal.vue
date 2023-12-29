<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  RequestToIdeaModalProps,
  RequestToIdeaModalEmits,
} from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import RequestToIdeaForm from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const props = defineProps<RequestToIdeaModalProps>()
const emit = defineEmits<RequestToIdeaModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestsToIdeaStore = useRequestsToIdeaStore()
const { requests } = storeToRefs(requestsToIdeaStore)

const ownerTeams = ref<Team[]>()
const requestTeams = ref<RequestTeamToIdea[]>()

watch(
  () => props.isOpened,
  async (isOpened) => {
    const currentUser = user.value

    if (isOpened && currentUser?.token && props.ideaMarket) {
      const { token, role } = currentUser
      const { id } = props.ideaMarket

      const parallelRequests: RequestConfig[] = [
        {
          request: () => TeamService.getOwnerTeams(id, token),
          refValue: ownerTeams,
          statement: role === 'TEAM_OWNER' || role === 'ADMIN',
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => requestsToIdeaStore.getRequestsToIdea(id, token),
          refValue: requestTeams,
          statement:
            role === 'INITIATOR' || role === 'TEAM_OWNER' || role === 'ADMIN',
          onErrorFunc: openErrorNotification,
        },
      ]

      await sendParallelRequests(parallelRequests)
    }
  },
)
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="ideaMarket"
      class="request-to-idea-modal bg-white rounded"
    >
      <div class="d-flex flex-column w-100">
        <div class="d-flex w-100 gap-2 p-2">
          <Button
            variant="primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="emit('close-modal')"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 border bg-white rounded-3 fs-4 text-primary text-nowrap"
          >
            {{ ideaMarket.name }}
          </Typography>
        </div>

        <RequestToIdeaForm
          v-if="ownerTeams"
          :idea-market="ideaMarket"
          :requests="requests"
          :owner-teams="ownerTeams"
        />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.request-to-idea-modal {
  position: relative;

  width: 50%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  overflow-y: scroll;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &-header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }
}

.modal-layout-enter-from .request-to-idea-modal,
.modal-layout-leave-to .request-to-idea-modal {
  transform: translateX(100%);
}
</style>
