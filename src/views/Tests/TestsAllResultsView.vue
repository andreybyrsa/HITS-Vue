<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import TestsAllResultsTable from '@Components/Tables/TestsTable/TestsAllResultsTable.vue'
import TestFormPlaceholder from '@Components/Forms/TestForm/TestFormPlaceholder.vue'

import { TestAllResponse } from '@Domain/Test'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTestStore from '@Store/tests/testsStore'
import TestService from '@Services/TestService'
import AllTestResultTable from '@Components/Tables/TestsTable/AllTestResultTable.vue'

const testStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
const testAllResults = ref<TestAllResponse[]>()

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TestService.getTestGeneral('ALL', token)
    if (response instanceof Error) {
      useNotificationsStore().createSystemNotification('Система', response.message)
      return
    }
    testStore.results = response
    testAllResults.value = response
  }
})

watch(
  testAllResults,
  async () => {
    if (user.value?.token) {
      const { token } = user.value
      await TestService.getTestGeneral('ALL', token)
    }
  },
  { deep: true },
)
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="quest-page__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <TestsAllResultsTable
        v-if="testAllResults"
        :results="testAllResults"
      />
      <router-view />
    </template>
  </PageLayout>
</template>
