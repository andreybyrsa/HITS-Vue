<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TeamMember, TeamInvitation } from '@Domain'
import { useInvitationUsersStore } from '@Store'
import {
  InvitationTeamMemberModalEmits,
  InvitationTeamMemberModalProps,
} from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import UsersInviteTable from '@Components/Tables/UsersInviteTable/UsersInviteTable.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

const invitationUsers = defineModel<TeamMember[]>({ required: true })
const newArrayUsers = ref<TeamMember[]>([])
const selectedUsers = ref<TeamMember[]>([])

const invitatinUsers = useInvitationUsersStore()
const route = useRoute()

const isLoading = ref(false)

const props = defineProps<InvitationTeamMemberModalProps>()
const emit = defineEmits<InvitationTeamMemberModalEmits>()

watch(
  () => props.isOpened,
  () => {
    if (props.isOpened) {
      selectedUsers.value = structuredClone(invitationUsers.value)
      newArrayUsers.value = structuredClone(invitationUsers.value)
    }
  },
)

watch(
  () => newArrayUsers.value.length,
  () => {
    selectedUsers.value = newArrayUsers.value
  },
)

function inviteUsers() {
  invitationUsers.value = selectedUsers.value
  emit('close-modal')
}

function cancelSelectedUsers(user: TeamMember) {
  newArrayUsers.value = newArrayUsers.value.filter(
    (selectedUser) => selectedUser.userId !== user.userId,
  )
}

async function inviteUsersInTeam() {
  if (route.params.teamId) {
    isLoading.value = true
    const { teamId } = route.params

    const invitationsToTeam = selectedUsers.value.map(
      ({ userId, email, firstName, lastName }) => ({
        teamId,
        userId,
        email,
        firstName,
        lastName,
      }),
    ) as TeamInvitation[]

    await invitatinUsers.inviteUsers(invitationsToTeam)

    selectedUsers.value = []
    newArrayUsers.value = []
    isLoading.value = false
    emit('close-modal')
  }
}

function closeInvitationModal() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeInvitationModal"
  >
    <div class="invitation-modal p-3 bg-white rounded">
      <div class="invitation-modal__header w-100">
        <Typography class-name="fs-5 text-primary">
          Выберите пользователей для приглашения
        </Typography>

        <Button
          variant="close"
          @click="closeInvitationModal"
        />
      </div>

      <div class="invitation-modal__table">
        <UsersInviteTable
          v-model="newArrayUsers"
          @close-modal="closeInvitationModal"
        />
      </div>

      <div class="w-100 p-2 border rounded">
        <div
          v-if="selectedUsers.length"
          class="d-flex gap-2 flex-wrap"
        >
          <div
            v-for="(user, index) in selectedUsers"
            :key="index"
            class="invitation-modal__selected-users p-1 rounded-3 bg-primary bg-opacity-25"
          >
            <Typography>{{ user.firstName }} {{ user.lastName }}</Typography>
            <Icon
              class-name="bi bi-x-lg"
              @click="cancelSelectedUsers(user)"
            />
          </div>
        </div>

        <div
          v-else
          class="m-1 w-100 text-center"
        >
          Никто не выбран
        </div>
      </div>

      <div class="invitation-modal__buttons">
        <Button
          v-if="!isCreateTeam"
          :is-loading="isLoading"
          variant="success"
          @click="inviteUsersInTeam"
        >
          Пригласить пользователей
        </Button>
        <Button
          v-if="isCreateTeam"
          variant="success"
          @click="inviteUsers"
        >
          Сохранить выбор
        </Button>
        <Button
          variant="danger"
          @click="closeInvitationModal"
        >
          Отменить выбор
        </Button>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.invitation-modal {
  width: 1000px;
  max-height: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(flex-start, space-between);
  }

  &__buttons {
    height: 100%;
    @include flexible(flex-end, flex-start, $gap: 16px);
  }

  &__table {
    max-height: 400px;
    overflow-y: scroll;
  }

  &__selected-users {
    width: fit-content;
    @include flexible(center, flex-start, $gap: 3px);
  }
}

.modal-layout-enter-from .invitation-modal,
.modal-layout-leave-to .invitation-modal {
  transform: scale(0.9);
}
</style>
