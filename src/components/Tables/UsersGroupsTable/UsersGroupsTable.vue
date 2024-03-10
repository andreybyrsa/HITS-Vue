<script lang="ts" setup>
import { ref } from 'vue'
import { UsersGroup, RolesTypes } from '@Domain'
import { useNotificationsStore } from '@Store'
import { UsersGroupsService } from '@Service'
import { getUserRolesInfo, getUserRoleInfoStyle } from '@Utils'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import Table from '@Components/Table/Table.vue'
import UsersGroupModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

const usersGroups = defineModel<UsersGroup[]>({ required: true })

const notificationsStore = useNotificationsStore()

const currentGroupId = ref()
const currentDeleteGroupId = ref<string | null>(null)
const currentDeleteGroupName = ref<string>()

const isOpenedCreatingGroupModal = ref(false)
const isOpenedUpdatingGroupModal = ref(false)
const isOpenedDeletingGroupModal = ref(false)

const availableRoles = getUserRolesInfo()
const rolesFilter = ref<RolesTypes[]>([])

const usersGroupsTableHeader: TableHeader = {
  label: 'Группы пользователей',
  countData: true,
  buttons: [
    {
      label: 'Создать группу',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: openCreatingGroupModal,
    },
  ],
}

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
    getRowCellStyle: getUserRoleInfoStyle,
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

function openCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = true
}
function closeCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = false
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
  currentDeleteGroupName.value = usersGroup.name
}
function closeDeletingGroupModal() {
  isOpenedDeletingGroupModal.value = false
}

const handleDeleteGroup = async () => {
  if (currentDeleteGroupId.value !== null) {
    const response = await UsersGroupsService.deleteUsersGroup(
      currentDeleteGroupId.value,
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

<template>
  <Table
    class-name="p-3"
    :header="usersGroupsTableHeader"
    :columns="usersGroupsTableColumns"
    :data="usersGroups"
    :search-by="['name']"
    :filters="usersGroupsFilters"
    :dropdown-actions-menu="dropdownUsersGroupsActions"
  ></Table>

  <UsersGroupModal
    :isOpened="isOpenedCreatingGroupModal"
    v-model="usersGroups"
    @close-modal="closeCreatingGroupModal"
  />
  <UsersGroupModal
    :isOpened="isOpenedUpdatingGroupModal"
    :users-group-id="currentGroupId"
    v-model="usersGroups"
    @close-modal="closeUpdatingGroupModal"
  />

  <DeleteModal
    :is-opened="isOpenedDeletingGroupModal"
    :item-name="currentDeleteGroupName"
    @delete="handleDeleteGroup"
    @close-modal="closeDeletingGroupModal"
  />
</template>
