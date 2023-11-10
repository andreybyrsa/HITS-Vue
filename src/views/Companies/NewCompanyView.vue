<script lang="ts" setup>
import CompanyForm from '@Components/Forms/TeamForm/TeamForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <CompanyForm />
    </template>
  </PageLayout>
</template>
