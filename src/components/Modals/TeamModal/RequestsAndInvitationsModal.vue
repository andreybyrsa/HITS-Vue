<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { storeToRefs } from 'pinia'

import useUserStore from '@Store/user/userStore'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  RequestsAndInvitationsEmits,
  RequestsAndInvitationsProps,
} from '@Components/Modals/TeamModal//RequestsAndInvitationsModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import TeamService from '@Services/TeamService'
import { TeamRequestsAndInvitations } from '@Domain/TeamRequest'
import RequestsTable from '@Components/Modals/TeamModal/RequestsTable.vue'
import InvitationsTable from './InvitationsTable.vue'
const props = defineProps<RequestsAndInvitationsProps>()

const emits = defineEmits<RequestsAndInvitationsEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const allInvitations = ref<TeamRequestsAndInvitations>()

function closeTeamModal() {
  emits('close-modal')
}

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.fetchInvitationsAndRequestions(
      props.team.id,
      token,
    )

    if (response instanceof Error) {
      return //уведомление об ошибке
    }

    allInvitations.value = response
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeTeamModal"
    ><div
      v-if="allInvitations"
      class="list-modal p-3"
    >
      <div class="list-modal__header">
        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-backspace-fill"
          @click="closeTeamModal"
        >
          Назад
        </Button>

        <Typography
          class-name="p-3 w-100 bg-white rounded-3 fs-6 text-primary text-nowrap overflow-x-scroll"
        >
          Завления и приглашения в команду {{ team.name }}
        </Typography>
      </div>
      <div class="list-modal__content">
        <div class="py-2 sh-50 w-100">
          <Typography class-name="fs-5 text-primary text-nowrap"
            >Заявления</Typography
          >
          <RequestsTable :requests="allInvitations.requests" />
        </div>
        <div class="py-2 h-50 w-100">
          <Typography class-name="fs-5 text-primary text-nowrap"
            >Приглашения</Typography
          >
          <InvitationsTable :invitations="allInvitations.invitations" />
        </div>
      </div>
    </div>
    <div v-else></div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.list-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    stretch,
    flex-start,
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__content {
    @include flexible(stretch, center, column, $gap: 16px);
  }
}

.modal-layout-enter-from .list-modal,
.modal-layout-leave-to .list-modal {
  transform: translateX(100%);
}
</style>
