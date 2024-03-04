<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Company } from '@Domain'
import { useNotificationsStore } from '@Store'
import { CompanyService } from '@Service'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import CompaniesTable from '@Components/Tables/CompaniesTable/CompaniesTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'

const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>()

onMounted(async () => {
  const responseGroups = await CompanyService.getAll()

  if (responseGroups instanceof Error) {
    return notificationsStore.createSystemNotification(
      'Система',
      responseGroups.message,
    )
  }

  companies.value = responseGroups
})
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="companies-view__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <CompaniesTable
        v-if="companies"
        v-model="companies"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.companies-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
