<template>
  <Table
    class-name="p-3"
    :header="sprintsTableHeader"
    :columns="usersTableColumns"
    :data="sprint"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownUsersActions"
    :filters="sprintsFilters"
  />
  <SprintModal
    :projectId="projectId"
    :is-opened="isOpenedSprintModal"
    :tasks="tasks"
    @close-modal="closeSprintModal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'

import SprintModal from '@Components/Modals/SprintModal/SprintModal.vue'
import SprintsTableProps from '@Components/Tables/SprintsTable/StprintsTable.types'
import Table from '@Components/Table/Table.vue'
import { useDateFormat } from '@vueuse/core'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'

import { Sprint, SprintStatus } from '@Domain/Project'

import { getSprintStatus, getSprintStatusStyle } from '@Utils/getSprintStatus'

defineProps<SprintsTableProps>()

const sprintsTableHeader: TableHeader = {
  label: 'Список спринтов',
  countData: true,
  buttons: [
    {
      label: 'Создать спринт',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: openSprintModal,
    },
  ],
}

const usersTableColumns: TableColumn<Sprint>[] = [
  {
    key: 'name',
    label: 'Название',
  },
  {
    key: 'status',
    label: 'Статус',
    getRowCellStyle: getSprintStatusStyle,
    getRowCellFormat: getSprintStatusFormat,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'finishDate',
    label: 'Дата окончания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    getRowCellStyle: getFinishDate,
  },
]

const currentSprint = ref<Sprint>()
const isOpenedSprintModal = ref(false)

function getSprintStatusFormat(status: SprintStatus) {
  return getSprintStatus().translatedStatus[status]
}

const dropdownUsersActions: DropdownMenuAction<Sprint>[] = [
  {
    label: 'Перейти в спринт',
    click: () => console.log(1),
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

function getFinishDate(date: string) {
  const initialClass: string[] = []

  if (date) {
    return initialClass
  }

  initialClass.push('text-primary')
  return initialClass
}

const availableStatus = getSprintStatus()
const filterBySprintStatus = ref<SprintStatus[]>([])

const sprintsFilters: Filter<Sprint>[] = [
  {
    category: 'Статус',
    choices: availableStatus.status.map((sprintStatus) => ({
      label: availableStatus.translatedStatus[sprintStatus],
      value: sprintStatus,
    })),
    refValue: filterBySprintStatus,
    isUniqueChoice: false,
    checkFilter: checkSprintStatus,
  },
]

function checkSprintStatus(sprint: Sprint, status: FilterValue) {
  return sprint.status === status
}

function openSprintModal() {
  isOpenedSprintModal.value = true
}

function closeSprintModal() {
  isOpenedSprintModal.value = false
}
</script>
