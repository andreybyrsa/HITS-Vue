<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMarketsStore, useNotificationsStore } from '@Store'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import MarketTable from '@Components/Tables/MarketTable/MarketTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const marketsStore = useMarketsStore()

const notificationsStore = useNotificationsStore()

const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  const response = await marketsStore.getAllMarkets()

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  isLoading.value = false
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="markets-view__content bg-white"
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
.markets-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
