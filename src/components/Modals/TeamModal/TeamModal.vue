<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useRoute, useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import TeamAction from '@Components/Modals/TeamModal/TeamAction.vue'
import TeamModalPlaceholder from '@Components/Modals/TeamModal/TeamModalPlaceholder.vue'
import TeamDescription from '@Components/Modals/TeamModal/TeamDescription.vue'
import TeamStuff from '@Components/Modals/TeamModal/TeamStuff.vue'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'
import TeamMember from '@Domain/TeamMember'

import Team from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const router = useRouter()

const team = ref<Team>()

const isOpened = ref<boolean>(true)

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const id = +route.params.teamId
    const { token } = currentUser
    const response = await TeamService.getTeam(id, token)

    if (response instanceof Error) {
      return
    }

    team.value = response
  }
})

const handleKick = async (member: TeamMember, teamId: number) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.kickMember(member, teamId, token)

    if (response instanceof Error) {
      return
    }
  }
}

function closeTeamModal() {
  isOpened.value = false
  router.go(-1)
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    appear-on-render
    @on-outside-close="closeTeamModal"
  >
    <div
      v-if="team"
      class="team-modal p-3 h-100 overflow-y-scroll"
      ref="teamModalRef"
    >
      <div class="team-modal__left-side w-75">
        <TeamDescription
          :team="team"
          @handle-kick="handleKick"
          @close-modal="closeTeamModal"
        />
      </div>
      <div class="team-modal__right-side p-3 rounded w-25 bg-white">
        <TeamStuff :team="team" />
        <TeamAction :team="team" />
      </div>
    </div>
    <TeamModalPlaceholder v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.team-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .team-modal,
.modal-layout-leave-to .team-modal {
  transform: translateX(100%);
}
</style>
