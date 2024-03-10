<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MODE } from '@Config'
import { useUserStore, useIdeasMarketStore } from '@Store'
import { getIdeaMarketStatus, navigateToAliasRoute } from '@Utils'
import { IdeaMarketInfoProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import { IdeaMarketInfoTabs } from '@Components/Modals/IdeaMarketModal/IdeaMarketInfoTabs'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'

const props = defineProps<IdeaMarketInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const isOpenedConfirmModal = ref(false)
const isCopiedLink = ref(false)

const route = useRoute()

const marketStatus = getIdeaMarketStatus()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function clickTab(key: string) {
  const { initiator } = props.ideaMarket

  if (key === 'initiator') {
    navigateToProfileModal(initiator.id)
  }
}

function valueTab(key: string) {
  const { customer, initiator, status } = props.ideaMarket

  if (key === 'customer') {
    return customer
  }
  if (key === 'initiator') {
    return initiator.firstName + ' ' + initiator.lastName
  }
  if (key === 'status') {
    return marketStatus.translatedStatus[
      status as keyof typeof marketStatus.translatedStatus
    ]
  }
  if (key === 'startDate') {
    return getFormattedDate(props.market?.startDate)
  }
  if (key === 'finishDate') {
    return getFormattedDate(props.market?.finishDate)
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
  const { id } = props.ideaMarket
  await ideasMarketStore.updateIdeaMarketStatus(id, 'RECRUITMENT_IS_CLOSED')
}

function openConfirmModal() {
  isOpenedConfirmModal.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}

function navigateToProfileModal(id: string) {
  const profileModalRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: Profile,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute('market-ideas', `/profile/${id}`, profileModalRoute)
}
</script>

<template>
  <div class="bg-white rounded w-100 mb-1">
    <div class="exchange-header w-100 bg-primary rounded-top fs-5 text-white p-2">
      Информация
    </div>
    <div class="exchange-info w-100 p-3">
      <div
        v-for="tab in IdeaMarketInfoTabs"
        :key="tab.id"
      >
        <Typography class-name="border-bottom text-secondary d-block">
          {{ tab.name }}
        </Typography>

        <div class="exchange-info__user pt-2">
          <Icon :class-name="`${tab.icon} text-secondary fs-2 opacity-25`" />

          <div
            @click="clickTab(String(tab.key))"
            :class="tab.key === 'initiator' && 'exchange-info__link'"
            class="text-primary"
          >
            {{ valueTab(String(tab.key)) }}
          </div>
        </div>
      </div>

      <!-- <Button
        v-if="getAccessToCloseRecruitment()"
        variant="danger"
        @click="openConfirmModal"
      >
        Закрыть набор
      </Button> -->

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

  &__link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }
}
</style>
