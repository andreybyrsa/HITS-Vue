<template>
  <Table
    :data="users"
    :columns="requestToTeamColumns"
    :search-by="['firstName', 'lastName']"
    :dropdown-actions-menu="dropdownRequestToTeamActions"
    :filters="usersFilters"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import type { UsersInviteTableProps } from '@Components/Tables/UsersInviteTable/UsersInviteTable.types'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'

import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import useUserStore from '@Store/user/userStore'

import { User } from '@Domain/User'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import { computed, ref } from 'vue'
import { Skill } from '@Domain/Skill'

const props = defineProps<UsersInviteTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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

const filterBySkill = ref<Skill[]>([])

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

function checkUsersSkill(user: User, status: FilterValue) {
  const userId = user.id

  console.log(status)
  return true
}

const dropdownRequestToTeamActions: DropdownMenuAction<User>[] = [
  { label: 'Перейти на профиль', click: () => null },
]
</script>
