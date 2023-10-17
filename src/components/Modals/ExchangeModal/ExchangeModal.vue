<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'

import ExchangeInfo from '@Components/Modals/ExchangeModal/ExchangeInfo.vue'
import ExchangeComments from '@Components/Modals/ExchangeModal/ExchangeComments.vue'
import ExchangeDescription from '@Components/Modals/ExchangeModal/ExchangeDescription.vue'
import ExchangeAcceptTeam from './ExchangeAcceptTeam.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'

import IdeasService from '@Services/IdeasService'
import TeamService from '@Services/TeamService'

import Team from '@Domain/Team'

defineProps<IdeaModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits<IdeaModalEmits>()

function closeExchangeModal() {
  emit('close-modal')
}

const ideas = ref()
const teams = ref<Team[]>([])
const isLoadingIdeas = ref(true)
const isLoadingTeams = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const id = '0'

    const responseIdea = await IdeasService.getInitiatorIdea(id, token)
    const responseTeams = await TeamService.getTeams(token)

    // const responseTeams = ref()
    // const responseIdea = ref()

    // await Promise.allSettled([
    //   await IdeasService.getInitiatorIdea(id, token),
    //   await TeamService.getTeams(token),
    // ]).then(
    //   (response) => (
    //     (responseIdea.value = response[0]), (responseTeams.value = response[1])
    //   ),
    // )

    if (responseIdea instanceof Error) {
      return
    }
    if (responseTeams instanceof Error) {
      return
    }

    ideas.value = responseIdea
    teams.value = responseTeams

    if (ideas.value) {
      isLoadingIdeas.value = false
    }
    if (teams.value) {
      isLoadingTeams.value = false
    }
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeExchangeModal"
  >
    <div class="exchange-modal p-3 h-100 overflow-y-scroll">
      <div class="exchange-modal__left-side w-75">
        <LoadingPlaceholder
          v-if="isLoadingIdeas"
          height="small"
        />
        <ExchangeDescription
          v-else
          :idea="ideas"
          @close-modal="closeExchangeModal"
        />

        <div class="exchange-modal__left-side-block bg-white rounded">
          Форма просмотра заявок
        </div>

        <ExchangeComments />
      </div>

      <div class="exchange-modal__right-side w-25 rounded">
        <LoadingPlaceholder
          v-if="isLoadingIdeas"
          height="medium"
        />
        <ExchangeInfo
          v-else
          :idea="ideas"
        />

        <LoadingPlaceholder
          v-if="isLoadingTeams"
          height="medium"
        />
        <ExchangeAcceptTeam
          v-else
          :teams="teams"
        />

        <div class="exchange-slills bg-white rounded w-100 p-3">
          <div class="exchange-slills-skill bg-secondary rounded text-white">a</div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">b</div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">c</div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">d</div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.exchange-slills {
  @include flexible(stretch, center, $gap: 16px);
  flex-wrap: wrap;

  &-skill {
    @include flexible(center, center);
    width: 100px;
    height: 100px;
  }
}
.exchange-modal {
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

    &-block {
      @include flexible(center, center);
      width: 100%;
      height: 500px;
    }
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .exchange-modal,
.modal-layout-leave-to .exchange-modal {
  transform: translateX(100%);
}
</style>
