<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'

import { UsersQuestStat } from '@Domain/Quest'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'
import { TableCollapse } from '@Components/Tables/QuestsTable/QuestTableCollapse.types'

const props = defineProps<TableCollapse>()
const usersQuestStat = ref<UsersQuestStat[]>(props.data.users)

const TableColumns = computed((): TableColumn<UsersQuestStat>[] => {
  const columns: TableColumn<UsersQuestStat>[] = [
    {
      contentClassName: 'ms-10 align-self-start',
      key: 'name',
    },
    {
      key: 'progress',
      contentClassName: 'ml-16  align-self-start',
      getRowCellStyle: getStatusStyle,
      getRowCellFormat: getTranslatedStatus,
    },
  ]
  return columns
})

const getStatusStyle = (closed: boolean) => {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (closed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}
const getTranslatedStatus = (closed: boolean) => {
  return closed ? 'Не пройден' : 'Пройден'
}
</script>

<template>
  <div class="ms-5 border-top border-bottom">
    <Table
      :data="usersQuestStat"
      :columns="TableColumns"
    >
    </Table>
  </div>
</template>

<style>
.ml-16 {
  margin-left: 13%;
}
.ms-10 {
  margin-left: 10%;
}
</style>
