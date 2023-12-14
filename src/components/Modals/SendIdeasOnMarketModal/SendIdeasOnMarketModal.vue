<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import {
  SendIdeasOnMarketModalProps,
  SendIdeasOnMarketModalEmits,
} from '@Components/Modals/SendIdeasOnMarketModal/SendIdeasOnMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Validation from '@Utils/Validation'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Idea } from '@Domain/Idea'
import IdeaMarket from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

import IdeasMarketService from '@Services/IdeasMarketService'
import MarketsService from '@Services/MarketsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<SendIdeasOnMarketModalProps>()
const emit = defineEmits<SendIdeasOnMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const notificationsStore = useNotificationsStore()

const checkedIdeas = ref<Idea[]>([])

const isLoading = ref(false)

const markets = ref<Market[]>([])
const marketsNames = computed(() => markets.value.map((market) => market.name))

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { id } = currentUser

    const response = await MarketsService.fetchMarkets(id)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    markets.value = response
  }
})

watchImmediate(
  () => props.checkedIdeas,
  (ideas) => {
    checkedIdeas.value = ideas
  },
  { deep: true },
)

const { handleSubmit } = useForm({
  validationSchema: {
    marketToSend: (value: Market) =>
      Validation.checkIsEmptyValue(value) || 'Выберите биржу',
  },
})

const sendIdeasToMarket = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const ideasMarket: IdeaMarket[] = checkedIdeas.value.map((idea) => {
      return {
        ...idea,
        position: 0,
        status: 'RECRUITMENT_IS_OPEN',
        requests: 0,
        acceptedRequests: 0,
        isFavorite: false,
        market: {},
      } as unknown as IdeaMarket
    })

    isLoading.value = true
    const response = await IdeasMarketService.sendIdeaOnMarket(ideasMarket, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideasStore.changeIdeasStatusOnMarket(checkedIdeas.value)

    isLoading.value = false
    emit('close-modal')
    emit('reset-checked-ideas')
  }
})

function deleteIdea(ideaId: string) {
  const ideaIndex = checkedIdeas.value.findIndex(({ id }) => id === ideaId)

  if (ideaIndex !== -1) {
    checkedIdeas.value.splice(ideaIndex, 1)

    if (checkedIdeas.value.length === 0) emit('close-modal')
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="send-ideas-on-market-modal bg-white rounded p-3">
      <div class="send-ideas-on-market-modal__idea-date w-100">
        <Typography class-name="fs-5 w-100 text-secondary border-bottom">
          Выберите биржу
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div class="w-100">
        <Combobox
          name="sendToIdeasMarket"
          label="Биржа*"
          :options="marketsNames"
          placeholder="Выберите биржу"
        />
      </div>

      <div class="send-ideas-on-market-modal__ideas d-flex flex-column gap-2 w-100">
        <div
          v-for="(idea, index) in checkedIdeas"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography class-name="text-primary w-100 border rounded p-2">
            {{ idea.name }}
          </Typography>
          <Button
            variant="outline-danger"
            append-icon-name="bi bi-x"
            @click="deleteIdea(idea.id)"
          />
        </div>
      </div>

      <Button
        variant="primary"
        @click="sendIdeasToMarket"
        :is-loading="isLoading"
      >
        Отправить на биржу
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.send-ideas-on-market-modal {
  width: 500px;
  max-height: 400px;
  overflow-y: scroll;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 8px
  );

  transition: all $default-transition-settings;

  &__idea-date {
    @include flexible(center, space-between, $gap: 8px);
  }

  &__ideas {
    max-height: 192px;
    overflow-y: scroll;
  }
}

.modal-layout-enter-from .letter-modal,
.modal-layout-leave-to .letter-modal {
  transform: scale(0.9);
}
</style>
