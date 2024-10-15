<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import ProjectListTable from '@Components/Tables/ProjectListTable/ProjectListTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import useUserStore from '@Store/user/userStore'
import useProjectsStore from '@Store/projects/projectsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

const isLoading = ref(false)

watchImmediate(
  () => user.value?.role,
  async (currentRole) => {
    const currentUser = user.value

    if (currentUser?.token && currentRole) {
      const { token } = currentUser

      isLoading.value = true

      if (currentRole === 'INITIATOR') {
        await projectsStore.getMyProjects(currentUser.id, token)
      } else {
        await projectsStore.getAllProjects(token)
      }

      isLoading.value = false
    }
  },
)
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
      <ProjectListTable
        v-if="!isLoading"
        :projects="projects"
      />
      <TablePlaceholder v-else />
      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped></style>
