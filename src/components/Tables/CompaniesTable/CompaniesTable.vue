<template>
  <Table
    :columns="companiesTableColumns"
    :data="companies"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownCompaniesActions"
  ></Table>

  <CompanyModal
    :isOpened="isOpenedUpdatingCompanyModal"
    :company-id="currentCompanyId"
    v-model="companies"
    @close-modal="closeUpdatingCompanyModal"
  />
  <DeleteModal
    :is-opened="isOpenedDeletingCompanyModal"
    @delete="handleDeleteCompany"
    @close-modal="closeDeletingCompanyModal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import CompanyModal from '@Components/Modals/CompanyModal/CompanyModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { User } from '@Domain/User'

const companies = defineModel<Company[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const currentCompanyId = ref<string>()
const currentDeleteCompanyId = ref<string | null>(null)

const isOpenedUpdatingCompanyModal = ref(false)
const isOpenedDeletingCompanyModal = ref(false)

const companiesTableColumns: TableColumn<Company>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: openUpdatingCompanyModal,
    getRowCellStyle: getCompanyNameStyle,
  },
  {
    key: 'owner',
    label: 'Владелец',
    getRowCellFormat: getCompanyOwnerFormat,
  },
]

const dropdownCompaniesActions: DropdownMenuAction<Company>[] = [
  {
    label: 'Редактировать',
    click: openUpdatingCompanyModal,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeletingCompanyModal,
  },
]

function getCompanyNameStyle() {
  return 'text-primary'
}

function getCompanyOwnerFormat(owner: User) {
  return `${owner.firstName} ${owner.lastName}`
}

function openUpdatingCompanyModal(company: Company) {
  currentCompanyId.value = company.id
  isOpenedUpdatingCompanyModal.value = true
}
function closeUpdatingCompanyModal() {
  isOpenedUpdatingCompanyModal.value = false
}

function openDeletingCompanyModal(company: Company) {
  isOpenedDeletingCompanyModal.value = true
  currentDeleteCompanyId.value = company.id
}
function closeDeletingCompanyModal() {
  isOpenedDeletingCompanyModal.value = false
}

const handleDeleteCompany = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentDeleteCompanyId.value !== null) {
    const { token } = currentUser
    const response = await CompanyService.deleteCompany(
      currentDeleteCompanyId.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    companies.value = companies.value.filter(
      (company) => company.id !== currentDeleteCompanyId.value,
    )
  }
}
</script>
