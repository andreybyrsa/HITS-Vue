<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'

import MarketInfo from '@Components/Modals/MarketModal/MarketInfo.vue'
import MarketComments from '@Components/Modals/MarketModal/MarketComments.vue'
import MarketDescription from '@Components/Modals/MarketModal/MarketDescription.vue'
import MarketAcceptTeam from './MarketAcceptTeam.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import JoinIdeaForm from '@Components/Forms/JoinIdeaForm/JoinIdeaForm.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'

import IdeasService from '@Services/IdeasService'
import TeamService from '@Services/TeamService'

import Team from '@Domain/Team'
import { Idea } from '@Domain/Idea'

defineProps<IdeaModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits<IdeaModalEmits>()

const route = useRoute()

function closeMarketModal() {
  emit('close-modal')
}

const ideas = ref<Idea[]>([])
const currentIdea = ref()
const teams = ref<Team[]>([])

const isLoadingIdea = ref(true)
const isLoadingTeams = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = route.params

    const responseIdea = await IdeasService.fetchIdeas(token)
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
    currentIdea.value = ideas.value.find((idea) => idea.id == id)

    teams.value = responseTeams

    if (currentIdea.value) {
      isLoadingIdea.value = false
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
    @on-outside-close="closeMarketModal"
  >
    <div class="exchange-modal p-3 h-100 overflow-y-scroll">
      <div class="exchange-modal__left-side w-75">
        <LoadingPlaceholder
          v-if="isLoadingIdea"
          height="small"
        />
        <MarketDescription
          v-else
          :idea="currentIdea"
          @close-modal="closeMarketModal"
        />

        <LoadingPlaceholder
          v-if="isLoadingIdea"
          height="medium-200"
        />
        <JoinIdeaForm
          v-else
          :idea="currentIdea"
        />

        <LoadingPlaceholder
          v-if="isLoadingIdea"
          height="medium-200"
        />
        <MarketComments
          v-else
          :idea="currentIdea"
        />
      </div>

      <div class="exchange-modal__right-side w-25 rounded">
        <LoadingPlaceholder
          v-if="isLoadingIdea"
          height="medium"
        />
        <MarketInfo
          v-else
          :idea="currentIdea"
        />

        <LoadingPlaceholder
          v-if="isLoadingTeams"
          height="medium"
        />
        <MarketAcceptTeam
          v-else
          :teams="teams"
        />

        <div class="exchange-slills bg-white rounded w-100 p-3">
          <div class="exchange-slills-skill bg-secondary rounded text-white">
            Языки
          </div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">
            Фреймворки
          </div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">
            Devops
          </div>
          <div class="exchange-slills-skill bg-secondary rounded text-white">
            База данных
          </div>
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
