<template>
  <Table
    class-name="pe-3"
    :columns="taskHistoryTableColumns"
    :data="logs"
    :dropdown-actions-menu="dropdownTaskHistoryActions"
  />

  <!-- <TaskHistoryModal
    v-if="currentLog"
    :is-opened="isOpenetTaskHistoryModal"
    :log="currentLog"
    @close-modal="closeTaskHistoryModal"
  /> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'

import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import { TaskMovementLog, TaskStatus } from '@Domain/Project'
import TaskService from '@Services/TaskService'
import TaskHistoryTableProps from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.types'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import TaskHistoryModal from '@Components/Modals/TaskHistoryModal/TaskHistoryModal.vue'

const props = defineProps<TaskHistoryTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const logs = ref<TaskMovementLog[]>([])
const currentLog = ref<TaskMovementLog>()

const isOpenetTaskHistoryModal = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const taskLogs = await TaskService.getTaskMovementLog(props.taskId, token)

    if (taskLogs instanceof Error) {
      useNotificationsStore().createSystemNotification('Система', taskLogs.message)
    } else {
      logs.value = taskLogs
    }
  }
})

const taskHistoryTableColumns: TableColumn<TaskMovementLog>[] = [
  {
    key: 'status',
    label: 'Статус',
    size: 'col-4',
    getRowCellStyle: getTaskHistoryStatusStyle,
  },
  {
    key: 'startDate',
    label: 'Дата вступления',
    size: 'col-4',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'endDate',
    label: 'Дата окончания',
    size: 'col-4',
    getRowCellFormat: getFormattedDate,
  },
]

const dropdownTaskHistoryActions: DropdownMenuAction<TaskMovementLog>[] = [
  {
    label: 'Подробнее',
    click: openTaskHistoryModal,
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY HH:mm')
    return formattedDate.value
  }
}

function openTaskHistoryModal(log: TaskMovementLog) {
  currentLog.value = log
  isOpenetTaskHistoryModal.value = true
}
function closeTaskHistoryModal() {
  isOpenetTaskHistoryModal.value = false
}

function getTaskHistoryStatusStyle(status: TaskStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'OnModification') {
    initialClass.push('bg-blueviolet-subtle', 'text-blueviolet')
    return initialClass
  }

  if (status === 'NewTask') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'InProgress') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'OnVerification') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }
  if (status === 'Done' || status === 'InBackLog') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}
</script>

<style scoped lang="scss"></style>
