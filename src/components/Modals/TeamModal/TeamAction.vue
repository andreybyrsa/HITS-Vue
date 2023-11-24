<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import {
  TeamActionProps,
  modalNames,
} from '@Components/Modals/TeamModal/TeamAction.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import TeamActionButtons from '@Components/Modals/TeamModal/TeamActionButtons.vue'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'

const teamStore = useTeamStore()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

defineProps<TeamActionProps>()
const router = useRouter()

const { deleteModal } = modalNames

const teamId = ref<string | null>(null)
const modalName = ref<string | null>(null)

const handleDeleteTeam = async () => {
  const currentUser = user.value
  if (currentUser?.token && teamId.value) {
    const { token } = currentUser
    await teamStore.deleteTeam(teamId.value, token)

    closeModal()
    router.go(-1)
  }
}

function openModal(id: string, modal: string) {
  teamId.value = id
  modalName.value = modal
}

function closeModal() {
  modalName.value = null
}
</script>
<template>
  <div
    class="team-action px-2 pb-2"
    v-if="team && user"
  >
    <TeamActionButtons
      :team="team"
      v-model="modalName"
      @open-modal="openModal"
    />

    <DeleteModal
      :is-opened="modalName === deleteModal"
      @close-modal="closeModal"
      @delete="handleDeleteTeam"
    />
  </div>
</template>
<style lang="scss" scoped>
.team-action {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
