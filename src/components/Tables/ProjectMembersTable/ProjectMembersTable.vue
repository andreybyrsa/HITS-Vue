<template>
  <Table
    class-name="p-3"
    :columns="usersTableColumns"
    :data="projectMembers"
    :search-by="['email', 'firstName', 'lastName']"
    :dropdown-actions-menu="dropdownUsersActions"
  />
</template>

<script lang="ts" setup>
import { RouteRecordRaw, useRouter } from 'vue-router'

import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProjectMembersTableProps from '@Components/Tables/ProjectMembersTable/ProjectMembersTable.types'
import Table from '@Components/Table/Table.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { ProjectMember, ProjectMemberRole } from '@Domain/Project'
import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'

defineProps<ProjectMembersTableProps>()

const router = useRouter()

const usersTableColumns: TableColumn<ProjectMember>[] = [
  {
    key: 'email',
    label: 'Почта',
    rowCellClick: navigateToUserProfile,
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
    key: 'role',
    label: 'Роль',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getRoleProjectMemberStyle,
    getRowCellFormat: getUserRolesFormat,
  },
]

function getUserRolesFormat(role: ProjectMemberRole) {
  return getRoleProjectMember().translatedRoles[role]
}

const dropdownUsersActions: DropdownMenuAction<ProjectMember>[] = [
  {
    label: 'Перейти на профиль',
    click: navigateToUserProfile,
  },
]

function navigateToUserProfile(member: ProjectMember) {
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: ProfileModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('project', profileRoute)
  router.push({ path: `/profile/${member.userId}` })
}
</script>
