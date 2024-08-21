<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import AllTestResultTable from '@Components/Tables/TestsTable/AllTestResultTable.vue'
import TestFormPlaceholder from '@Components/Forms/TestForm/TestFormPlaceholder.vue'

import { TestResult } from '@Domain/Test'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import TestService from '@Services/TestService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
const testResult = ref<TestResult[]>()

onMounted(async () => {
  const testName = route.params.testName
  if (testName) {
    try {
      const currentUser = user.value
      if (currentUser?.token) {
        const testName = route.params.testName.toString()
        const { token } = currentUser
        const response = await TestService.getAllTestResult(testName, token)
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return
        }
        testResult.value = response
      }
    } catch (error) {
      console.error('Ошибка при получении результатов', error)
      return
    }
  } else {
    router.push('/tests/list')
  }
})
watch(
  testResult,
  async () => {
    if (user.value?.token) {
      const testName = route.params.testName.toString()
      const { token } = user.value
      await TestService.getAllTestResult(testName, token)
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
      <AllTestResultTable
        v-if="testResult"
        :results="testResult"
      />
      <TestFormPlaceholder v-else />
      <router-view />
    </template>
  </PageLayout>
</template>
