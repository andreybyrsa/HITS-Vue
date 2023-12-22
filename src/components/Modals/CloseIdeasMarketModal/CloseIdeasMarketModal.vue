<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import {
  CloseIdeasMarketModalProps,
  CloseIdeasMarketModalEmits,
} from '@Components/Modals/CloseIdeasMarketModal/CloseIdeasMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'
import useMarketsStore from '@Store/markets/marketsStore'

const props = defineProps<CloseIdeasMarketModalProps>()
const emit = defineEmits<CloseIdeasMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const marketsStore = useMarketsStore()

const isLoading = ref(false)

const router = useRouter()

async function closeIdeasMarket() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true

    const { id } = props.market

    await marketsStore.updateMarketStatus(id, 'DONE', token)

    isLoading.value = false
    emit('close-modal')
    router.push({ name: 'markets-list' })
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="close-ideas-market-modal bg-white rounded p-3"
    >
      <div class="close-ideas-market-modal__idea-date w-100">
        <Typography class-name="fs-5 w-100 text-secondary border-bottom">
          Закрытие биржи
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div>
        <Typography class-name="fs-6 w-100 text-danger">
          Идеи, не нашедшие команды, попадут обратно в список идей*
        </Typography>
      </div>

      <div
        class="close-ideas-market-modal__ideas d-flex flex-column w-100 flex-wrap gap-2"
      >
        <div
          v-for="(idea, index) in props.ideasMarket"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography class-name="text-primary border rounded p-2 w-100">
            {{ idea.name }}
          </Typography>
        </div>
      </div>

      <Button
        variant="danger"
        @click="closeIdeasMarket"
        :is-loading="isLoading"
      >
        Закрыть биржу
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.close-ideas-market-modal {
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

.modal-layout-enter-from .close-ideas-market-modal,
.modal-layout-leave-to .close-ideas-market-modal {
  transform: scale(0.9);
}
</style>
