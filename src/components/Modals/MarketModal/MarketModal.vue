<script lang="ts" setup>
import { onMounted, ref, VueElement } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  MarketModalProps,
  MarketModalEmits,
} from '@Components/Modals/MarketModal/MarketModal.types'

import MarketInfo from '@Components/Modals/MarketModal/MarketInfo.vue'
import MarketComments from '@Components/Modals/MarketModal/MarketComments.vue'
import IdeaComments from '@Components/Modals/IdeaModal/IdeaComments.vue'
import MarketDescription from '@Components/Modals/MarketModal/MarketDescription.vue'
import MarketAcceptTeam from './MarketAcceptTeam.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import JoinIdeaForm from '@Components/Forms/JoinIdeaForm/JoinIdeaForm.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

import Team from '@Domain/Team'
import IdeasMarketService from '@Services/MarketServise'
import Market from '@Domain/Market'
import useCommentsStore from '@Store/comments/commentsStore'

defineProps<MarketModalProps>()

const MarketModalRef = ref<VueElement | null>(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits<MarketModalEmits>()

const route = useRoute()

function closeMarketModal() {
  emit('close-modal')
}

const idea = ref<Market>()
const teams = ref<Team[]>([])

const isLoadingIdea = ref(true)
const isLoadingTeams = ref(true)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const id = +route.params.id

    const responseIdea = await IdeasMarketService.getIdeaMarket(token, id)
    const responseTeams = await TeamService.getTeams(token)
    await useCommentsStore().getComments(id, token)

    if (responseIdea instanceof Error) {
      return
    }
    if (responseTeams instanceof Error) {
      return
    }

    idea.value = responseIdea

    teams.value = responseTeams

    if (idea.value) {
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
    <div
      ref="MarketModalRef"
      class="exchange-modal p-3 h-100 overflow-y-scroll"
    >
      <div class="exchange-modal__left-side w-75">
        <MarketDescription
          v-if="idea"
          :idea="idea"
          @close-modal="closeMarketModal"
        />
        <LoadingPlaceholder
          v-else
          height="small"
        />

        <JoinIdeaForm
          v-if="idea"
          :idea="idea"
        />
        <LoadingPlaceholder
          v-else
          height="medium-200"
        />

        <IdeaComments
          v-if="idea"
          :idea="idea"
          :idea-modal-ref="MarketModalRef"
        />
        <!-- <MarketComments
          v-if="idea"
          :idea="idea"
        /> -->
        <!-- Компонент Комментарии -->
        <!-- Собрать все типы один файл -->
        <!-- Параллельный запрос -->
        <!-- Заглушку засунуть в компонент -->
        <!-- <LoadingPlaceholder
          v-else
          height="medium-200"
        /> -->
      </div>

      <div class="exchange-modal__right-side w-25 rounded">
        <MarketInfo
          v-if="idea"
          :idea="idea"
        />
        <LoadingPlaceholder
          v-else
          height="medium"
        />

        <MarketAcceptTeam
          v-if="teams"
          :teams="teams"
        />
        <LoadingPlaceholder
          v-else
          height="medium"
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
