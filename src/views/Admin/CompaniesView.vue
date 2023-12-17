<template>
  <PageLayout content-class-name="companies-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
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

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import CompaniesTable from '@Components/Tables/CompaniesTable/CompaniesTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseGroups = await CompanyService.getCompanies(token)

    if (responseGroups instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseGroups.message,
      )
    }

    companies.value = responseGroups
  }
})
</script>

<style lang="scss">
.companies-page {
  &__content {
    overflow-y: scroll;
  }
}
</style>
