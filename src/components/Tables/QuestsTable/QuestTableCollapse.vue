<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'

import { TeamQuestStat } from '@Domain/Quest'
import QuestTableCollapseTeamLevel from './QuestTableCollapseTeamLevel.vue'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'
import { TableCollapse } from '@Components/Tables/QuestsTable/QuestTableCollapse.types'

const props = defineProps<TableCollapse>()
const teamQuestStat = ref<TeamQuestStat[]>(props.data.teams)

const getFormatProgress = (progress: string) => {
  return Math.floor(parseFloat(progress)).toString() + ' %'
}

const TableColumns = computed((): TableColumn<TeamQuestStat>[] => {
  const columns: TableColumn<TeamQuestStat>[] = [
    {
      contentClassName: 'col align-self-start',
      key: 'name',
    },
    {
      contentClassName:
        'col justify-content-center align-items-center text-center ps-20',
      key: 'progress',
      getRowCellStyle: getStatusStyle,
      getRowCellFormat: getFormatProgress,
    },
  ]
  return columns
})

const getStatusStyle = (percent: string) => {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (Number(percent) < 50) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
  if (Number(percent) == 100) {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
  initialClass.push('bg-warning-subtle', 'text-warning')
  return initialClass
}
</script>

<template>
  <div class="ms-5 border-top border-bottom">
    <Table
      :data="teamQuestStat"
      :columns="TableColumns"
      :collapse-child-component="QuestTableCollapseTeamLevel"
    >
    </Table>
  </div>
</template>

<style>
.ps-20 {
  padding-left: 20%;
}
</style>
