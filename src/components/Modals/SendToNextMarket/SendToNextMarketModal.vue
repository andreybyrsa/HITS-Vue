<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import {
  SendToNextMarketModalProps,
  SendToNextMarketModalEmits,
} from '@Components/Modals/SendToNextMarket/SendToNextMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Validation from '@Utils/Validation'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import IdeaMarket from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

import IdeasMarketService from '@Services/IdeasMarketService'
import MarketsService from '@Services/MarketsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'

const props = defineProps<SendToNextMarketModalProps>()
const emit = defineEmits<SendToNextMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const noTeamIdeas = ref<IdeaMarket[]>([])
const checkedIdeasMarket = ref<IdeaMarket[]>([])

const isLoading = ref(false)

const market = ref<Market>()
const markets = ref<Market[]>([])

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

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

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id } = currentUser

    const profileParallelRequests = [
      () => MarketsService.fetchMarkets(id),
      () => MarketsService.fetchMarket(id),
      () => IdeasMarketService.fetchIdeasMarket(token),
    ]

    await makeParallelRequests<Market[] | Market | IdeaMarket[] | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, markets)
        }
        if (response.id == 1) {
          checkResponseStatus(response, market)
        }
        if (response.id === 2) {
          checkResponseStatus(response, checkedIdeasMarket)
        }
      })
    })
  }
  checkedIdeasMarket.value.forEach((idea) => {
    if (idea.team == null) {
      noTeamIdeas.value.push(idea)
    }
  })
})

// watchImmediate(
//   () => props.checkedIdeasMarket,
//   (ideas) => {
//     checkedIdeasMarket.value = ideas
//   },
//   { deep: true },
// )

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

    isLoading.value = true

    const { id, status } = market.value

    const response = await MarketsService.updateMarketStatus(id, status, token)

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
          Закрытие биржи
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div>
        <Typography class-name="fs-6 w-100 text-secondary border-bottom">
          *при закрытии биржи идеи, не нашедшие команды, попадут обратно в список
          идей
        </Typography>
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
        Закрыть биржу
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
