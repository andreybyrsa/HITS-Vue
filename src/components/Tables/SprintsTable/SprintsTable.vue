<template>
  <Table
    class-name="p-3"
    :header="sprintsTableHeader"
    :columns="usersTableColumns"
    :data="sortSprintsList(sprints)"
    :search-by="['name']"
  />

  <SpintInfoModal
    :is-opened="isOpenedSprintInfoModal"
    :sprint-id="sprintId"
    :project="project"
    @close-modal="closeSprintInfoModal"
  />

  <SprintModal
    :is-opened="isOpenedSprintModal"
    :sprint="sprint"
    :project="project"
    @close-modal="closeSprintModal"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'

import SpintInfoModal from '@Components/Modals/SprintInfoModal/SprintInfoModal.vue'
import SprintModal from '@Components/Modals/SprintModal/SprintModal.vue'
import SprintsTableProps from '@Components/Tables/SprintsTable/StprintsTable.types'
import Table from '@Components/Table/Table.vue'
import { useDateFormat } from '@vueuse/core'

import { Sprint, SprintStatus } from '@Domain/Project'

import { getSprintStatus, getSprintStatusStyle } from '@Utils/getSprintStatus'

import useUserStore from '@Store/user/userStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

const props = defineProps<SprintsTableProps>()

const sprintsStore = useSprintsStore()
const { activeSprint } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedSprintModal = ref(false)
const isOpenedSprintInfoModal = ref(false)
const sprintId = ref<string>('')
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
    rowCellClick: OpenSprintModal,
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

function OpenSprintModal(currentSprint: Sprint) {
  if (currentSprint.status === 'ACTIVE') {
    sprint.value = activeSprint?.value
    isOpenedSprintModal.value = true
  } else openSprintInfoModal(currentSprint)
}

function closeSprintModal() {
  sprint.value = undefined
  isOpenedSprintModal.value = false
}

function openSprintInfoModal(sprint: Sprint) {
  isOpenedSprintInfoModal.value = true
  sprintId.value = sprint.id
}

function closeSprintInfoModal() {
  isOpenedSprintInfoModal.value = false
}
</script>
