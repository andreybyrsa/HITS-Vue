<template>
  <Table
    :header="usersTableHeader"
    :columns="usersTableColumns"
    :data="users"
    :search-by="['email', 'firstName', 'lastName']"
    :filters="usersFilters"
    :dropdown-actions-menu="dropdownUsersActions"
  ></Table>

  <EditUserModal
    :is-opened="isOpenedUpdatingUserModal"
    :user="updatingUser"
    v-model="users"
    @close-modal="handleCloseUpdatingModal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'

import { User } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import { getUserRolesInfo, getUserRoleInfoStyle } from '@Utils/userRolesInfo'

const users = defineModel<User[]>({ required: true })

const rolesFilter = ref<RolesTypes[]>([])

const updatingUser = ref<User | null>(null)
const isOpenedUpdatingUserModal = ref(false)

const availableRoles = getUserRolesInfo()

const usersTableHeader: TableHeader = {
  label: 'Список пользователей',
  countData: true,
}

const usersTableColumns: TableColumn<User>[] = [
  {
    key: 'email',
    label: 'Почта',
    getRowCellStyle: getUserEmailStyle,
    rowCellClick: handleOpenUpdatingModal,
  },
  {
    key: 'firstName',
    label: 'Имя',
  },
  {
    key: 'lastName',
    label: 'Фамилия',
  },
  {
    key: 'roles',
    label: 'Роли',
    size: 'col-5',
    getRowCellStyle: getUserRoleInfoStyle,
    getRowCellFormat: getUserRolesFormat,
  },
]

const dropdownUsersActions: DropdownMenuAction<User>[] = [
  {
    label: 'Редактировать',
    click: handleOpenUpdatingModal,
  },
]

const usersFilters: Filter<User>[] = [
  {
    category: 'Роли',
    choices: availableRoles.roles.map((role) => ({
      label: availableRoles.translatedRoles[role],
      value: role,
    })),
    refValue: rolesFilter,
    isUniqueChoice: false,
    checkFilter: checkUserRoles,
  },
]

function getUserEmailStyle() {
  return 'text-primary'
}

function getUserRolesFormat(roles: RolesTypes[], index: number) {
  const currentRole = roles[index]
  return availableRoles.translatedRoles[currentRole]
}

function checkUserRoles(user: User, role: FilterValue) {
  return user.roles.find((userRole) => userRole === role)
}

function handleOpenUpdatingModal(currentUser: User) {
  const selectedUser = users.value.find((user) => user.id === currentUser.id)

  if (selectedUser) {
    updatingUser.value = { ...selectedUser }
    isOpenedUpdatingUserModal.value = true
  }
}

function handleCloseUpdatingModal() {
  isOpenedUpdatingUserModal.value = false
}
</script>
