<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useUserStore, useIdeasStore } from '@Store'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import IdeasTable from '@Components/Tables/IdeasTable/IdeasTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()

const isLoading = ref(false)

watchImmediate(
  () => user.value?.role,
  async (currentRole) => {
    if (currentRole) {
      isLoading.value = true
      await ideaStore.getIdeas(currentRole)
      isLoading.value = false
    }
  },
)
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="ideas-page__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <IdeasTable v-if="!isLoading" />
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
