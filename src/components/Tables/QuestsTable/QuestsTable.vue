<script lang="ts" setup>
import { Filter } from '@Components/FilterBar/FilterBar.types'
import {
  TableColumn,
  TableHeader,
  CheckedDataAction,
  DropdownMenuAction,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import useUserStore from '@Store/user/userStore'
import useQuestStore from '@Store/quests/questsStore'
import { storeToRefs } from 'pinia'
import { QuestShort } from '@Domain/Quest'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const questStore = useQuestStore()

const { user } = storeToRefs(userStore)
const { quests } = storeToRefs(questStore)

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questStore.getQuests(token)
  }
})

const questsTableHeader: TableHeader = {
  label: 'Шаблоны опросов',
  countData: true,
  buttons: [
    {
      label: 'Создать шаблон опроса',
      variant: 'primary',
      statement: true,
      click: () => true,
    },
  ],
}

const getTranslatedWorkStatus = (available: boolean) => {
  return available ? 'Открыт' : 'Завершен'
}

const questsTableColumns: TableColumn<QuestShort>[] = [
  {
    key: 'name',
    label: 'Название',
  },
  {
    key: 'available',
    label: 'Статус',
    getRowCellFormat: getTranslatedWorkStatus,
  },
]

const dropdownUsersActions: DropdownMenuAction<QuestShort>[] = [
  // {
  //   label: 'Просмотреть опрос',
  //   click: navigateToUserProfile,
  // },
  // {
  //   label: 'Завершить',
  //   click: handleOpenUpdatingModal,
  // },
  // {
  //   label: 'Удалить',
  //   className: 'text-danger',
  //   click: openConfirmModal,
  // },
]

const questsFilters: Filter<QuestShort>[] = [
  // {
  //   category: 'Роли',
  //   choices: availableRoles.roles.map((role) => ({
  //     label: availableRoles.translatedRoles[role],
  //     value: role,
  //   })),
  //   refValue: rolesFilter,
  //   isUniqueChoice: false,
  //   checkFilter: checkUserRoles,
  // },
  // {
  //   category: 'Студенты',
  //   choices: [
  //     { label: 'В команде', value: true },
  //     { label: 'Не в команде', value: false },
  //   ],
  //   refValue: usersInTeamsFilter,
  //   isUniqueChoice: true,
  //   checkFilter: checkUsersInTeams,
  // },
]
</script>

<template>
  <Table
    class-name="p-3"
    :header="questsTableHeader"
    :columns="questsTableColumns"
    :data="quests"
    :search-by="['name']"
    :filters="questsFilters"
  />
</template>
