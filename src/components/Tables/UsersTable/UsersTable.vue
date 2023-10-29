<template>
  <Table
    :columns="usersTableColumns"
    :data="usersData"
    search-by="email"
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
import { computed, ref } from 'vue'

import { Filter } from '@Components/FilterBar/FilterBar.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'

import { User } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import getRoles from '@Utils/getRoles'
import getRolesStyle from '@Utils/getRolesStyle'

const users = defineModel<User[]>({ required: true })

const rolesFilter = ref<RolesTypes[]>([])
const availableRoles = getRoles()

const updatingUser = ref<User | null>(null)
const isOpenedUpdatingUserModal = ref(false)

const usersData = computed<User[]>(() => {
  if (rolesFilter.value.length) {
    return users.value.filter((user) =>
      rolesFilter.value.some((role) => user.roles.includes(role)),
    )
  }
  return users.value
})

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
    getRowCellStyle: getRolesStyle,
    getRowCellFormat: getUserRolesFormat,
  },
]

const dropdownUsersActions: DropdownMenuAction<User>[] = [
  {
    label: 'Редактировать',
    click: handleOpenUpdatingModal,
  },
]

const usersFilters: Filter[] = [
  {
    category: 'Роли',
    choices: [
      { label: 'Инициатор', value: 'INITIATOR' },
      { label: 'Проектный офис', value: 'PROJECT_OFFICE' },
      { label: 'Эксперт', value: 'EXPERT' },
      { label: 'Админ', value: 'ADMIN' },
    ],
    refValue: rolesFilter,
    isUniqueChoice: false,
  },
]

function getUserEmailStyle() {
  return 'text-primary'
}

function getUserRolesFormat(roles: RolesTypes[], index: number) {
  const currentRole = roles[index]
  return availableRoles.translatedRoles[currentRole]
}

function handleOpenUpdatingModal(currentUser: User) {
  const selectedUser = users.value.find((user) => user.id === currentUser.id)

  if (selectedUser) {
    updatingUser.value = { ...selectedUser }
    isOpenedUpdatingUserModal.value = true
  }
}

function handleCloseUpdatingModal() {
  updatingUser.value = null
  isOpenedUpdatingUserModal.value = false
}
</script>
