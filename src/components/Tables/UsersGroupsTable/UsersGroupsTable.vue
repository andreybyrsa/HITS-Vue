<template>
  <Table
    :columns="usersGroupsTableColumns"
    :data="usersGroups"
    search-by="name"
    :filters="usersGroupsFilters"
    :dropdown-actions-menu="dropdownUsersGroupsActions"
  ></Table>

  <UsersGroupModal
    :isOpened="isOpenedUpdatingGroupModal"
    :users-group-id="currentGroupId"
    v-model="usersGroups"
    @close-modal="closeUpdatingGroupModal"
  />
  <DeleteModal
    :is-opened="isOpenedDeletingGroupModal"
    @delete="handleDeleteGroup"
    @close-modal="closeDeletingGroupModal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import UsersGroupModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'

import UsersGroup from '@Domain/UsersGroup'
import RolesTypes from '@Domain/Roles'

import UsersGroupsService from '@Services/UsersGroupsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import getRoles from '@Utils/getRoles'
import getRolesStyle from '@Utils/getRolesStyle'

const usersGroups = defineModel<UsersGroup[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const currentGroupId = ref()
const currentDeleteGroupId = ref<number | null>(null)

const isOpenedUpdatingGroupModal = ref(false)
const isOpenedDeletingGroupModal = ref(false)

const availableRoles = getRoles()
const rolesFilter = ref<RolesTypes[]>([])

const usersGroupsTableColumns: TableColumn<UsersGroup>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: openUpdatingGroupModal,
    getRowCellStyle: getGroupNameStyle,
  },
  {
    key: 'roles',
    label: 'Роли',
    size: 'col-5',
    getRowCellStyle: getRolesStyle,
    getRowCellFormat: getGroupRolesFormat,
  },
]

const dropdownUsersGroupsActions: DropdownMenuAction<UsersGroup>[] = [
  {
    label: 'Редактировать',
    click: openUpdatingGroupModal,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeletingGroupModal,
  },
]

const usersGroupsFilters: Filter<UsersGroup>[] = [
  {
    category: 'Роли',
    choices: [
      { label: 'Инициаторы', value: 'INITIATOR' },
      { label: 'Проектный офис', value: 'PROJECT_OFFICE' },
      { label: 'Эксперты', value: 'EXPERT' },
      { label: 'Админы', value: 'ADMIN' },
    ],
    refValue: rolesFilter,
    isUniqueChoice: false,
    checkFilter: checkUsersGroupRoles,
  },
]

function getGroupNameStyle() {
  return 'text-primary'
}

function getGroupRolesFormat(roles: RolesTypes[], index: number) {
  const currentRole = roles[index]
  return availableRoles.translatedGroups[currentRole]
}

function checkUsersGroupRoles(usersGroup: UsersGroup, role: FilterValue) {
  return usersGroup.roles.find((usersGroupRole) => usersGroupRole === role)
}

function openUpdatingGroupModal(usersGroup: UsersGroup) {
  currentGroupId.value = usersGroup.id
  isOpenedUpdatingGroupModal.value = true
}
function closeUpdatingGroupModal() {
  isOpenedUpdatingGroupModal.value = false
}

function openDeletingGroupModal(usersGroup: UsersGroup) {
  isOpenedDeletingGroupModal.value = true
  currentDeleteGroupId.value = usersGroup.id
}
function closeDeletingGroupModal() {
  isOpenedDeletingGroupModal.value = false
}

const handleDeleteGroup = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentDeleteGroupId.value !== null) {
    const { token } = currentUser
    const response = await UsersGroupsService.deleteUsersGroup(
      currentDeleteGroupId.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    usersGroups.value = usersGroups.value.filter(
      (group) => group.id !== currentDeleteGroupId.value,
    )
  }
}
</script>