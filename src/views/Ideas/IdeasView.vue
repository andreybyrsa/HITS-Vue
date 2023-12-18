<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import IdeasTable from '@Components/Tables/IdeasTable/IdeasTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

const notificationsStore = useNotificationsStore()

const ideas = ref<Idea[]>()

watchImmediate(
  () => user.value?.role,
  async (currentRole) => {
    const currentUser = user.value

    if (currentUser?.token && currentRole) {
      const { token } = currentUser

      const response = await ideaStore.getIdeas(currentRole, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      ideas.value = response
    }
  },
)
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <!-- <template #header>
      <Header></Header>
    </template> -->

    <template #content>
      <IdeasTable
        v-if="ideas"
        :ideas="ideas"
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
