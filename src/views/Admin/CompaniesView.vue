<template>
  <PageLayout content-class-name="companies-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="companies-page__header">
        <Typography class-name="fs-2 text-primary">Список компаний</Typography>

        <Button
          variant="primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="openCreatingCompanyModal"
        >
          Создать компанию
        </Button>
      </div>

      <template v-if="companies">
        <CompaniesTable v-model="companies" />

        <CompanyModal
          :isOpened="isOpenedCreatingCompanyModal"
          v-model="companies"
          @close-modal="closeCreatingCompanyModal"
        />
      </template>

      <TablePlaceholder v-else />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import CompaniesTable from '@Components/Tables/CompaniesTable/CompaniesTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import CompanyModal from '@Components/Modals/CompanyModal/CompanyModal.vue'
import Button from '@Components/Button/Button.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>()

const isOpenedCreatingCompanyModal = ref(false)

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

function openCreatingCompanyModal() {
  isOpenedCreatingCompanyModal.value = true
}
function closeCreatingCompanyModal() {
  isOpenedCreatingCompanyModal.value = false
}
</script>

<style lang="scss">
.companies-page {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    overflow-y: scroll;
  }
}
</style>
