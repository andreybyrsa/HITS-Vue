<script lang="ts" setup>
import TeamForm from '@Components/Forms/TeamForm/TeamForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <TeamForm />

      <router-view />
    </template>
  </PageLayout>
</template>
