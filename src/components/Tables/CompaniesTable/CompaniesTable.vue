<template>
  <Table
    :columns="companyTableColumns"
    :data="companies"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownCompaniesActions"
  ></Table>

  <DeleteModal
    :is-opened="isOpenedCompanyDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteCompany"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = defineModel<Company[]>({ required: true })

const deletingCompanyId = ref<number | null>(null)
const isOpenedCompanyDeleteModal = ref(false)

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)

const companyTableColumns: TableColumn<Company>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    rowCellClick: navigateToCompanyModal,
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
    label: 'Просмотреть',
    click: navigateToCompanyModal,
  },
  {
    label: 'Редактировать',
    statement: checkUpdateCompanyAction,
    click: navigateToCompanyForm,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkDeleteCompanyAction,
    click: handleOpenDeleteModal,
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
  companies.value.sort((team1, team2) => {
    const comparingDate1 = new Date(team1.membersCount).getTime()
    const comparingDate2 = new Date(team2.membersCount).getTime()

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

function navigateToCompanyModal(company: Company) {
  router.push(`/companies/list/${company.id}`)
}

function navigateToCompanyForm(company: Company) {
  router.push(`/companies/update/${company.id}`)
}

function handleOpenDeleteModal(company: Company) {
  deletingCompanyId.value = company.id
  isOpenedCompanyDeleteModal.value = true
}

function handleCloseDeleteModal() {
  isOpenedCompanyDeleteModal.value = false
}

async function handleDeleteCompany() {
  const currentUser = user.value

  if (currentUser?.token && deletingCompanyId.value !== null) {
    const { token } = currentUser

    const response = await CompanyService.deleteCompany(
      deletingCompanyId.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const deletingCompanyIndex = companies.value.findIndex(
      (team) => team.id === deletingCompanyId.value,
    )

    if (deletingCompanyIndex !== -1) {
      companies.value.splice(deletingCompanyIndex, 1)
    }
  }
}

function checkDeleteCompanyAction(company: Company) {
  const currentUser = user.value

  const { owner } = company
  return currentUser?.role === 'ADMIN' || currentUser?.email === owner.email
}

function checkUpdateCompanyAction(company: Company) {
  const currentUser = user.value

  const { owner } = company
  return currentUser?.role === 'ADMIN' || currentUser?.email === owner.email
}
</script>
