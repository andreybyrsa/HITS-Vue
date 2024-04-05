<script lang="ts" setup>
import { Filter } from '@Components/FilterBar/FilterBar.types'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import useUserStore from '@Store/user/userStore'
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'
import { storeToRefs } from 'pinia'
import { LaunchQuest } from '@Domain/Quest'
import { onMounted } from 'vue'

const userStore = useUserStore()
const launchQuestStore = useLaunchQuestStore()

const { user } = storeToRefs(userStore)
const { launchQuests } = storeToRefs(launchQuestStore)

onMounted(async () => {
  if (user.value?.token) {
    await launchQuestStore.getLaunchQuests(user.value.token)
  }
})

const launchQuestsTableHeader: TableHeader = {
  label: 'Запущенные опросы',
  countData: true,
}

const getTranslatedWorkStatus = (available: boolean) => {
  return available ? 'Открыт' : 'Завершен'
}

const launchQuestsTableColumns: TableColumn<LaunchQuest>[] = [
  {
    key: 'name',
    label: 'Название',
  },
  {
    key: 'startAt',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Дата начала',
  },
  {
    key: 'endAt',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Дата окончания',
  },
  {
    key: 'passingResult',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Результат прохождения',
  },
  {
    key: 'available',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Статус',
    getRowCellFormat: getTranslatedWorkStatus,
  },
]

const launchQuestsTableDropdownMenuAction: DropdownMenuAction<LaunchQuest>[] = [
  {
    label: 'Просмотреть',
    statement: () => true,
    click: () => 1,
  },
]
</script>

<template>
  <Table
    class-name="p-3"
    :header="launchQuestsTableHeader"
    :columns="launchQuestsTableColumns"
    :dropdown-actions-menu="launchQuestsTableDropdownMenuAction"
    :data="launchQuests"
    :search-by="['name']"
  />
</template>
