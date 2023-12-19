<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { MODE } from '@Main'

import { MarketInfoProps } from '@Components/Modals/MarketModal/MarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import MarketInfoTabs from '@Components/Modals/MarketModal/MarketInfoIdeaTabs'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

import { IdeaMarket } from '@Domain/IdeaMarket'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import getMarketStatus from '@Utils/getMarketStatus'

const props = defineProps<MarketInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const isOpenedConfirmModal = ref(false)
const isCopiedLink = ref(false)

const route = useRoute()

const marketStatus = getMarketStatus()

function valueTab(key: keyof IdeaMarket) {
  const { customer, initiator, status } = props.ideaMarket

  if (key === 'customer') {
    return customer
  }
  if (key === 'initiator') {
    return initiator.firstName + ' ' + initiator.lastName
  }
  if (key === 'status') {
    return marketStatus.translatedStatus[status]
  }
  if (key === 'startDate') {
    return '12.12.2000'
  }
  if (key === 'finishDate') {
    return '12.12.2000'
  }
}

function copyLink() {
  const link =
    MODE === 'DEVELOPMENT'
      ? `http://localhost:8080${route.fullPath}`
      : `https://hits.tyuiu.ru${route.fullPath}`

  navigator.clipboard.writeText(link)
  isCopiedLink.value = true
}

function getAccessToCloseRecruitment() {
  const currentUser = user.value
  const { initiator, status } = props.ideaMarket

  if (currentUser) {
    const { id, role } = currentUser

    return (
      id === initiator.id && role === 'INITIATOR' && status === 'RECRUITMENT_IS_OPEN'
    )
  }
}

async function changeIdeaMarketStatus() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.ideaMarket

    await ideasMarketStore.updateIdeaMarketStatus(id, 'RECRUITMENT_IS_CLOSED', token)
  }
}

function openConfirmModal() {
  isOpenedConfirmModal.value = true
}
function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}
</script>

<template>
  <div class="bg-white rounded">
    <div class="exchange-header w-100 bg-primary rounded-top fs-5 text-white p-2">
      Информация
    </div>

    <div class="exchange-info w-100 p-3">
      <div
        v-for="tab in MarketInfoTabs"
        :key="tab.id"
      >
        <Typography class-name="border-bottom text-secondary d-block">
          {{ tab.name }}
        </Typography>

        <div class="exchange-info__user pt-2">
          <Icon :class-name="`${tab.icon} text-secondary fs-2 opacity-25`" />

          <Typography class-name="text-primary">
            {{ valueTab(tab.key) }}
          </Typography>
        </div>
      </div>

      <Button
        v-if="getAccessToCloseRecruitment()"
        variant="danger"
        @click="openConfirmModal"
      >
        Закрыть набор
      </Button>

      <Button
        variant="primary"
        @click="copyLink"
      >
        {{ isCopiedLink ? 'Ссылка скопирована!' : 'Поделиться идеей' }}
      </Button>
    </div>
  </div>

  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Закрыть набор"
    text-question="Вы действительно закрыть набор?"
    @close-modal="closeConfirmModal"
    @action="changeIdeaMarketStatus"
  />
</template>

<style lang="scss" scoped>
.exchange-header {
  @include flexible(center, center);
}
.exchange-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__user {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__users {
    @include flexible(stretch, flex-start, column, $gap: 8px);
  }
}
</style>
