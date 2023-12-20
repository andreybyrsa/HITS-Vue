<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import MarketTable from '@Components/Tables/MarketTable/MarketTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'
import useMarketsStore from '@Store/markets/marketsStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const marketsStore = useMarketsStore()

const notificationsStore = useNotificationsStore()

const isLoading = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    const response = await marketsStore.getAllMarkets(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    isLoading.value = false
  }
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="markets-page__content p-3 bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <MarketTable v-if="!isLoading" />

      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(stretch, flex-start, column);
  }
}
</style>
