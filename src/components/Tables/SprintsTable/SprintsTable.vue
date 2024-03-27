<template>
  <Table
    class-name="p-3"
    :header="sprintsTableHeader"
    :columns="usersTableColumns"
    :data="sortSprintsList(sprints)"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownUsersActions"
  />
  <SprintModal
    :is-opened="isOpenedSprintModal"
    :sprint="sprint"
    :project="project"
    @close-modal="closeSprintModal"
  />
  <SprintInfoModal
    :is-opened="isOpenedSprintInfoModal"
    :isSprinInfoModal="isOpenedSprintInfoModal"
    :sprint="sprint"
    :project="project"
    @close-modal="closeSprintInfoModal"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'

import SprintModal from '@Components/Modals/SprintModal/SprintModal.vue'
import SprintInfoModal from '@Components/Modals/SprintInfoModal/SprintInfoModal.vue'

import SprintsTableProps from '@Components/Tables/SprintsTable/StprintsTable.types'
import Table from '@Components/Table/Table.vue'
import { useDateFormat } from '@vueuse/core'

import { Sprint, SprintStatus } from '@Domain/Project'

import { getSprintStatus, getSprintStatusStyle } from '@Utils/getSprintStatus'

import useUserStore from '@Store/user/userStore'

const props = defineProps<SprintsTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedSprintModal = ref(false)
const isOpenedSprintInfoModal = ref(false)
const sprint = ref<Sprint>()

const sprintsTableHeader = computed<TableHeader>(() => ({
  label: 'Список спринтов',
  countData: true,
  buttons: [
    {
      label: 'Создать спринт',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: openSprintModal,
      statement:
        Boolean(!props.sprints.find(({ status }) => status === 'ACTIVE')) &&
        user.value?.role === 'TEAM_LEADER',
    },
  ],
}))

const usersTableColumns: TableColumn<Sprint>[] = [
  {
    key: 'name',
    size: 'col-3',
    label: 'Название',

    rowCellClick: OpenEditSprintModalOrSprintInfoModal,
  },
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getSprintStatusStyle,
    getRowCellFormat: getSprintStatusFormat,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    contentClassName: 'justify-content-center align-items-center text-center',
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

function sortSprintsList(sprintsList: Sprint[]) {
  return sprintsList.sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate))
}

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

function openSprintModal() {
  isOpenedSprintModal.value = true
}

function OpenEditSprintModalOrSprintInfoModal(currentSprint: Sprint) {
  if (currentSprint.status === 'ACTIVE') {
    sprint.value = currentSprint
    isOpenedSprintModal.value = true
  } else {
    sprint.value = currentSprint
    isOpenedSprintInfoModal.value = true
  }
}

function closeSprintModal() {
  sprint.value = undefined
  isOpenedSprintModal.value = false
}

function closeSprintInfoModal() {
  sprint.value = undefined
  isOpenedSprintInfoModal.value = false
}
</script>
