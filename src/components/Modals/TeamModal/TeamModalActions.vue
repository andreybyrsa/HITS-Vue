<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import {
  TeamModalActionsProps,
  TeamModalActionsEmits,
} from '@Components/Modals/TeamModal/TeamModal.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import InvitationTeamMemberModal from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.vue'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'

const props = defineProps<TeamModalActionsProps>()
const emit = defineEmits<TeamModalActionsEmits>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsStore = useTeamStore()

const isOpenedDeletingModal = ref(false)
const isOpenedInvitationModal = ref(false)

function getAccessToEdit() {
  if (user.value) {
    const { id, role } = user.value
    const { owner, leader } = props.team

    return role === 'ADMIN' || id === owner.id || id === leader?.id
  }
}

function getAccessToDelete() {
  if (user.value) {
    const { id, role } = user.value
    const { owner } = props.team

    return role === 'ADMIN' || id === owner.id
  }
}

function getAccessToLeave() {
  if (user.value) {
    const { id } = user.value
    const { owner, members } = props.team

    return id !== owner.id && members.find((user) => user.id === id)
  }
}

function navigateToUpdateTeamForm() {
  router.push(`/teams/update/${props.team.id}`)
}

function openDeletingModal() {
  isOpenedDeletingModal.value = true
}

function closeDeletingModal() {
  isOpenedDeletingModal.value = false
}

function openInvitationModal() {
  isOpenedInvitationModal.value = true
}

function closeInvitationModal() {
  isOpenedInvitationModal.value = false
}

async function handleDeleteTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.team

    await teamsStore.deleteTeam(id, token).then(() => emit('close-modal'))
  }
}
</script>

<template>
  <div
    v-if="getAccessToEdit() || getAccessToDelete()"
    class="rounded-3 bg-white p-3 d-flex flex-wrap gap-3"
  >
    <Button
      v-if="getAccessToEdit()"
      variant="light"
      @click="navigateToUpdateTeamForm"
    >
      Редактировать
    </Button>

    <Button
      v-if="getAccessToDelete()"
      variant="danger"
      @click="openDeletingModal"
    >
      Удалить команду
    </Button>

    <Button
      v-if="getAccessToDelete()"
      variant="primary"
      @click="openInvitationModal"
    >
      Пригласить пользователя
    </Button>

    <!-- <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openDeletingModal"
    >
      Выйти из команды
    </Button>

    <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openDeletingModal"
    >
      Подать заявку
    </Button>

    <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openDeletingModal"
    >
      Принять заявку
    </Button>

    <Button
      v-if="getAccessToLeave()"
      variant="danger"
      @click="openDeletingModal"
    >
      Отклонить заявку
    </Button> -->

    <DeleteModal
      :is-opened="isOpenedDeletingModal"
      @delete="handleDeleteTeam"
      @close-modal="closeDeletingModal"
    />

    <InvitationTeamMemberModal
      :is-opened="isOpenedInvitationModal"
      @close-modal="closeInvitationModal"
    />
  </div>
</template>
