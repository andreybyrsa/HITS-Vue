<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import CompaniesTable from '@Components/Tables/CompaniesTable/CompaniesTable.vue'

import Company from '@Domain/Company'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>()

const router = useRouter()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await CompanyService.getCompanies(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    companies.value = response
  }
})

function navigateToCreateCompanyPage() {
  router.push('/companies/create')
}
</script>

<template>
  <PageLayout content-class-name="companies-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="companies-page__header w-100">
        <Typography class-name="fs-2 text-primary">Список компаний</Typography>
        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="navigateToCreateCompanyPage"
        >
          Создать компанию
        </Button>
      </div>

      <CompaniesTable
        v-if="companies"
        v-model="companies"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.companies-page {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(stretch, flex-start, column);
  }
}
</style>
