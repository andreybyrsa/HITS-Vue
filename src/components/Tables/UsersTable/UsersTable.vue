<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, RouteRecordRaw } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { User, RolesTypes } from '@Domain'
import { useNotificationsStore } from '@Store'
import { ManageUsersService } from '@Service'
import {
  getUserRolesInfo,
  getUserRoleInfoStyle,
  mutableSort,
  navigateToAliasRoute,
} from '@Utils'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import { UsersTableProps } from '@Components/Tables/UsersTable/UsersTable.types'
import Table from '@Components/Table/Table.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

const props = defineProps<UsersTableProps>()

const users = defineModel<User[]>({ required: true })

const rolesFilter = ref<RolesTypes[]>([])
const usersInTeamsFilter = ref<boolean>()

const updatingUser = ref<User | null>(null)
const isOpenedUpdatingUserModal = ref(false)
const isOpenedConfirmModal = ref(false)
const currentUserId = ref('')

const route = useRoute()

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
    key: 'createdAt',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Дата регистрации',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
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
    label: 'Перейти на профиль',
    click: navigateToUserProfile,
  },
  {
    label: 'Редактировать',
    click: handleOpenUpdatingModal,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openConfirmModal,
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
  {
    category: 'Студенты',
    choices: [
      { label: 'В команде', value: true },
      { label: 'Не в команде', value: false },
    ],
    refValue: usersInTeamsFilter,
    isUniqueChoice: true,
    checkFilter: checkUsersInTeams,
  },
]

async function deleteUser() {
  const response = await ManageUsersService.deleteUser(currentUserId.value)

  if (response instanceof Error) {
    return useNotificationsStore().createSystemNotification(
      'Система',
      response.message,
    )
  }

  users.value = users.value.filter(({ id }) => id !== currentUserId.value)
}

function navigateToUserProfile(user: User) {
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profil/:id',
    alias: '/profile/:id',
    component: ProfileModal,
    props: {
      canGoBack: true,
    },
  }

  const { id } = user
  const { name } = route
  if (name) {
    navigateToAliasRoute(name.toString(), `/profile/${id}`, profileRoute)
  }
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function sortByCreatedAt() {
  mutableSort(users.value, (user: User) => new Date(user.createdAt ?? '').getTime())
}

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

function checkUsersInTeams(user: User, value: FilterValue) {
  const teamMemberId = props.usersInTeams.map((user) => {
    return user.userId
  })

  if (user.roles.includes('MEMBER'))
    return value ? teamMemberId.includes(user.id) : !teamMemberId.includes(user.id)
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

function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}

function openConfirmModal(currentUser: User) {
  currentUserId.value = currentUser.id
  isOpenedConfirmModal.value = true
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="usersTableHeader"
    :columns="usersTableColumns"
    :data="users"
    :search-by="['email', 'firstName', 'lastName']"
    :filters="usersFilters"
    :dropdown-actions-menu="dropdownUsersActions"
  />

  <EditUserModal
    :is-opened="isOpenedUpdatingUserModal"
    :user="updatingUser"
    v-model="users"
    @close-modal="handleCloseUpdatingModal"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Удалить"
    text-question="Вы действительно хотите удалить пользователя?"
    @close-modal="closeConfirmModal"
    @action="deleteUser"
  />
</template>
