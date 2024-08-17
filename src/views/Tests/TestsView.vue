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
      <TestsTable
        v-if="tests"
        v-model="tests"
      />
      <TablePlaceholder v-else />
      <router-view />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import TestsTable from '@Components/Tables/TestsTable/TestsTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import { Test } from '@Domain/Test'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTestStore from '@Store/tests/testsStore'
import TestService from '@Services/TestService'

const testStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const tests = ref<Test[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TestService.getAllTests(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    tests.value = response
  }
})
</script>
