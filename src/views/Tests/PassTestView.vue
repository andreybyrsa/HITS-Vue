<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import BelbinTestForm from '@Components/Forms/TestForm/BelbinTestForm.vue'
import TemperTestForm from '@Components/Forms/TestForm/TemperTestForm.vue'
import MindTestForm from '@Components/Forms/TestForm/MindTestForm.vue'
import TestFormPlaceholder from '@Components/Forms/TestForm/TestFormPlaceholder.vue'

import { Test } from '@Domain/Test'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import TestService from '@Services/TestService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
const test = ref<Test>()

onMounted(async () => {
  const testName = route.params.testName
  if (testName) {
    try {
      const currentUser = user.value
      if (currentUser?.token) {
        const testName = route.params.testName.toString()
        const { token } = currentUser
        const response = await TestService.getTest(testName, token)
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return
        }
        test.value = response
      }
    } catch (error) {
      console.error('Ошибка при получении теста', error)
      return
    }
  } else {
    router.push('/tests/list')
  }
})
watch(
  test,
  async () => {
    if (user.value?.token && test.value?.testName) {
      const { token } = user.value
      const { id: testName } = test.value
      await TestService.getTest(testName, token)
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
      <BelbinTestForm v-if="test?.testName == 'BelbinTest'" />
      <TemperTestForm v-if="test?.testName == 'TemperTest'" />
      <MindTestForm v-if="test?.testName == 'MindTest'" />
      <TestFormPlaceholder
        v-if="
          test?.testName != 'BelbinTest' &&
          test?.testName != 'TemperTest' &&
          test?.testName != 'MindTest'
        "
      />
      <router-view />
    </template>
  </PageLayout>
</template>
