<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import useUserStore from '@Store/user/userStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import useQuestsStore from '@Store/quests/questsStore'
import useTeamStore from '@Store/teams/teamsStore'
import { Quest, QuestStat, TeamQuestStat, UsersQuestStat } from '@Domain/Quest'

import Table from '@Components/Table/Table.vue'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import { TableCollapse } from '@Components/Tables/QuestsTable/QuestTableCollapse.types'

import { OptionType } from '@Components/Inputs/Select/Select.types'

const props = defineProps<TableCollapse>()
const usersQuestStat = ref<UsersQuestStat[]>(props.data.users)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const getFormatProgress = (progress: string) => {
  return Math.floor(parseFloat(progress)).toString() + ' %'
}

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

function getStatusStyle(closed: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (closed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}
function getTranslatedStatus(closed: boolean) {
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
