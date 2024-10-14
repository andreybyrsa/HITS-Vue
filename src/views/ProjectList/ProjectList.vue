<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import ProjectListTable from '@Components/Tables/ProjectListTable/ProjectListTable.vue'

import useUserStore from '@Store/user/userStore'
import useProjectsStore from '@Store/projects/projectsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    if (currentUser.roles.includes('INITIATOR')) {
      await projectsStore.getMyProjects(currentUser.id, token)
    } else {
      await projectsStore.getAllProjects(token)
    }
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
      <ProjectListTable :projects="projects" />
      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped></style>
