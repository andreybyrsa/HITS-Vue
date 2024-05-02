<template>
  <Table
    :columns="taskHistoryTableColumns"
    :data="logs"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'

import { TaskMovementLog, TaskStatus } from '@Domain/Project'
import TaskService from '@Services/TaskService'
import TaskHistoryTableProps from '@Components/Tables/TaskHistoryTable/TaskHistoryTable.types'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { getTaskStatus, getTaskStatusStyle } from '@Utils/getTaskStatus'

const props = defineProps<TaskHistoryTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const logs = ref<TaskMovementLog[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const taskLogs = await TaskService.getTaskMovementLog(props.taskId, token)
    console.log(taskLogs)

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
    size: 'col-3',
    contentClassName: 'ms-2',
    getRowCellStyle: getTaskStatusStyle,
    getRowCellFormat: (status: TaskStatus) =>
      getTaskStatus().translatedStatus[status],
  },
  {
    key: 'startDate',
    label: 'Дата вступления',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'endDate',
    label: 'Дата окончания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'wastedTime',
    label: 'Продолжительность',
    contentClassName: 'justify-content-center align-items-center text-center',
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY, HHч mmмин')
    return formattedDate.value
  }
}
</script>

<style scoped lang="scss"></style>
