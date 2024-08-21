<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import TestListTable from '@Components/Tables/TestsTable/TestListTable.vue'
import useUserStore from '@Store/user/userStore'
import useTestStore from '@Store/tests/testsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const testsStore = useTestStore()
const { tests } = storeToRefs(testsStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await useTestStore().getAllTests(token)
  }
})
</script>
<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="project-page__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <TestListTable :tests="tests" />
      <router-view />
    </template>
  </PageLayout>
</template>
