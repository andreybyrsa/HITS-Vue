<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { storeToRefs } from 'pinia'

import useUserStore from '@Store/user/userStore'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  TeamAccessionsModalEmits,
  TeamAccessionsModalProps,
} from '@Components/Modals/TeamAccessionsModal/TeamAccessionsModal.types'
import TeamAccessionsHeader from '@Components/Modals/TeamAccessionsModal/TeamAccessionsHeader.vue'
import TeamAccessionsTable from '@Components/Tables/TeamAccessionsTable/TeamAccessionsTable.vue'

import TeamService from '@Services/TeamService'
import { TeamAccession } from '@Domain/TeamAccession'

const props = defineProps<TeamAccessionsModalProps>()

const emits = defineEmits<TeamAccessionsModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const allAccessions = ref<TeamAccession[]>()

function closeTeamModal() {
  emits('close-modal')
}

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.getAllTeamAccessions(props.team.id, token)

    if (response instanceof Error) {
      return //уведомление об ошибке
    }

    allAccessions.value = response
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeTeamModal"
    ><div
      v-if="allAccessions"
      class="list-modal p-3"
    >
      <TeamAccessionsHeader
        :team="team"
        @close-team-modal="closeTeamModal"
      />
      <TeamAccessionsTable
        :team="team"
        v-model="allAccessions"
      />
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
  background-color: #ffffff;

  @include flexible(
    stretch,
    flex-start,
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;
}

.modal-layout-enter-from .list-modal,
.modal-layout-leave-to .list-modal {
  transform: translateX(100%);
}
</style>
