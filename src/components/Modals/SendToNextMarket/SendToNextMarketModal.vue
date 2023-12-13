<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import {
  SendToNextMarketModalProps,
  SendToNextMarketModalEmits,
} from '@Components/Modals/SendToNextMarket/SendToNextMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Validation from '@Utils/Validation'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import IdeaMarket from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

import IdeasMarketService from '@Services/IdeasMarketService'
import MarketService from '@Services/MarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<SendToNextMarketModalProps>()
const emit = defineEmits<SendToNextMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const noTeamIdeas = ref<IdeaMarket[]>([])
const checkedIdeasMarket = ref<IdeaMarket[]>([])

const isLoading = ref(false)

const markets = ref<Market[]>([])
const marketsNames = computed(() => markets.value.map((market) => market.name))

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { id } = currentUser

    const response = await MarketService.fetchMarket(id)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    markets.value = response
  }
})

watchImmediate(
  () => props.checkedIdeasMarket,
  (ideas) => {
    checkedIdeasMarket.value = ideas
  },
  { deep: true },
)

const { handleSubmit } = useForm({
  validationSchema: {
    marketToSend: (value: Market) =>
      Validation.checkIsEmptyValue(value) || 'Выберите биржу',
  },
})

for (const ideaMarket of checkedIdeasMarket.value) {
  if (ideaMarket.team === null) {
    noTeamIdeas.value.push(ideaMarket)
  }
}

const sendIdeasToMarket = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const ideasMarket: IdeaMarket[] = noTeamIdeas.value.map((idea) => {
      return {
        ...idea,
        position: 0,
        status: 'RECRUITMENT_IS_OPEN',
        requests: 0,
        acceptedRequests: 0,
        isFavorite: false,
        team: null,
        market: {},
      } as unknown as IdeaMarket
    })

    isLoading.value = true
    const response = await IdeasMarketService.sendIdeaOnMarket(ideasMarket, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    isLoading.value = false
    emit('close-modal')
    emit('reset-no-team-ideas')
  }
})
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
          v-for="(idea, index) in noTeamIdeas"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography class-name="text-primary w-100 border rounded p-2">
            {{ idea.name }}
          </Typography>
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
