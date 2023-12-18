<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import MarketGuideTable from '@Components/Tables/MarketGuideTable/MarketGuideTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore' // change
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { Market } from '@Domain/Market'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const ideaStore = useIdeasStore() // change
const notificationsStore = useNotificationsStore()

const market = ref<Market[]>([
  {
    id: '0',
    name: 'Осенняя биржа',
    startDate: '01.10.2023',
    finishDate: '01.12.2023',
    status: 'DONE',
  },
  {
    id: '1',
    name: 'Зимняя биржа',
    startDate: '01.12.2023',
    finishDate: '01.03.2024',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Весенняя биржа',
    startDate: '01.03.2024',
    finishDate: '01.06.2024',
    status: 'NEW',
  },
  {
    id: '3',
    name: 'Крутая биржа',
    startDate: '01.03.2024',
    finishDate: '01.06.2024',
    status: 'DONE',
  },
  {
    id: '4',
    name: 'Биржа акций',
    startDate: '01.03.2024',
    finishDate: '01.06.2024',
    status: 'NEW',
  },
  {
    id: '5',
    name: 'Биржа биткоинов',
    startDate: '01.03.2024',
    finishDate: '01.06.2024',
    status: 'ACTIVE',
  },
])
// watchImmediate(
//   () => user.value?.role,
//   async (currentRole) => {
//     const currentUser = user.value
//     if (currentUser?.token && currentRole) {
//       const { token } = currentUser
//       const response = await ideaStore.getIdeas(currentRole, token)
//       if (response instanceof Error) {
//         return notificationsStore.createSystemNotification(
//           'Система',
//           response.message,
//         )
//       }
//       market.value = response
//     }
//   },
// )
</script>
<template>
  <PageLayout content-class-name="ideas-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <MarketGuideTable
        v-if="market"
        :market="market"
      />
      <TablePlaceholder v-else />
      <router-view />
    </template>
  </PageLayout>
</template>
<style lang="scss">
.ideas-page {
  &__content {
    overflow-y: scroll;
    @include flexible(stretch, flex-start, column);
  }
}
</style>
