<template>
  <Table
    :data="users"
    :columns="requestToTeamColumns"
    :search-by="['firstName', 'lastName']"
    :dropdown-actions-menu="dropdownRequestToTeamActions"
    :filters="usersFilters"
    v-model="invitationUsers"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import type { UsersInviteTableProps } from '@Components/Tables/UsersInviteTable/UsersInviteTable.types'
import {
  CheckedDataAction,
  DropdownMenuAction,
  TableColumn,
} from '@Components/Table/Table.types'

import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import useUserStore from '@Store/user/userStore'

import { User } from '@Domain/User'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import { computed, ref } from 'vue'
import { Skill } from '@Domain/Skill'

const props = defineProps<UsersInviteTableProps>()
const invitationUsers = defineModel<User[]>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const filterBySkill = ref<Skill[]>([])

const requestToTeamColumns: TableColumn<User>[] = [
  {
    key: 'firstName',
    label: 'Имя',
    size: 'col-4',
  },
  {
    key: 'lastName',
    label: 'Фамилия',
    size: 'col-6',
  },
]

const usersFilters = computed<Filter<User>[]>(() => [
  {
    category: 'Компетенции',
    choices: props.skills.map(({ name }) => ({
      label: name,
      value: name,
    })),
    refValue: filterBySkill,
    isUniqueChoice: false,
    checkFilter: checkUsersSkill,
  },
])

function checkUsersSkill(user: User, skillName: FilterValue) {
  const userSkills = props.usersSkills.find(
    (userSkill) => userSkill.idUsers === user.id,
  )

  return userSkills?.skills.find((skill) => skill.name === skillName)
}

const dropdownRequestToTeamActions: DropdownMenuAction<User>[] = [
  { label: 'Перейти на профиль', click: () => null },
]
</script>
