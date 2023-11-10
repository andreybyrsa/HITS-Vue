<template>
  <Table
    :columns="companiesTableColumns"
    :data="companies"
    :search-by="['name']"
    :filters="companiesFilters"
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
import CompanyModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const companies = defineModel<Company[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const currentCompanyId = ref()
const currentDeleteCompanyId = ref<number | null>(null)

const isOpenedUpdatingCompanyModal = ref(false)
const isOpenedDeletingCompanyModal = ref(false)

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)

const companiesTableColumns: TableColumn<Company>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: openUpdatingCompanyModal,
    getRowCellStyle: getCompanyNameStyle,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  {
    key: 'createdAt',
    label: 'Дата создания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
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

function sortByCreatedAt() {
  companies.value.sort((company1, company2) => {
    const comparingDate1 = new Date(company1.createdAt).getTime()
    const comparingDate2 = new Date(company2.createdAt).getTime()

    if (isSortedByCreatedAt.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByCreatedAt.value = !isSortedByCreatedAt.value
}

function sortByMembersCount() {
  teams.value.sort((company1, company2) => {
    const comparingDate1 = new Date(company1.membersCount).getTime()
    const comparingDate2 = new Date(company2.membersCount).getTime()

    if (isSortedByMembersCount.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByMembersCount.value = !isSortedByMembersCount.value
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getCompanyNameStyle() {
  return 'text-primary'
}

function openUpdatingCompanyModal(company: Company) {
  currentComapnyId.value = company.id
  isOpenedUpdatingcompanyModal.value = true
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

    company.value = companies.value.filter(
      (company) => company.id !== currentDeleteGroupId.value,
    )
  }
}
</script>
