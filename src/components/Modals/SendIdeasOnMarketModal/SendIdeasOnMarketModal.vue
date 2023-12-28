<script lang="ts" setup>
import { ref, onMounted } from 'vue'
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

import IdeasMarketService from '@Services/IdeasMarketService'
import MarketsService from '@Services/MarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import { Market } from '@Domain/Market'

const props = defineProps<SendIdeasOnMarketModalProps>()
const emit = defineEmits<SendIdeasOnMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const notificationsStore = useNotificationsStore()

const checkedIdeas = ref<Idea[]>([])

const isLoading = ref(false)

const marketsActive = ref<Market[]>([])
const selectedMarketActive = ref<Market>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await MarketsService.getAllActiveMarkets(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    marketsActive.value = response
  }
})

watchImmediate(
  () => props.ideas,
  (value) => {
    checkedIdeas.value = value
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
  const currentMarket = selectedMarketActive.value

  if (currentUser?.token && currentMarket) {
    const { token } = currentUser
    const { id } = currentMarket
    isLoading.value = true

    const response = await IdeasMarketService.sendIdeaOnMarket(
      id,
      checkedIdeas.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideasStore.changeIdeasStatusOnMarket(checkedIdeas.value)

    isLoading.value = false
    emit('close-modal')
  }
})

function resetIdea(ideaId: string) {
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
          Отправить {{ checkedIdeas.length === 1 ? 'идею' : 'идеи' }} на биржу
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div class="w-100">
        <Combobox
          name="marketToSend"
          label="Биржа*"
          :options="marketsActive"
          :displayBy="(['name'] as never)"
          placeholder="Выберите биржу"
          v-model="selectedMarketActive"
        />
      </div>

      <div class="send-ideas-on-market-modal__ideas d-flex flex-column gap-2 w-100">
        <Typography class-name="w-100 text-primary">
          {{ checkedIdeas.length === 1 ? 'Выбранная идея' : 'Выбранные идеи' }}*
        </Typography>
        <div
          v-for="(idea, index) in ideas"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography
            class-name="send-ideas-on-market-modal__idea-name w-100 border rounded p-2"
          >
            {{ idea.name }}
          </Typography>
          <Button
            variant="outline-danger"
            append-icon-name="bi bi-x"
            @click="resetIdea(idea.id)"
          />
        </div>
      </div>

      <Button
        variant="success"
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

  &__idea-name {
    @include textEllipsis(1);
  }
}

.modal-layout-enter-from .send-ideas-on-market-modal,
.modal-layout-leave-to .send-ideas-on-market-modal {
  transform: scale(0.9);
}
</style>
