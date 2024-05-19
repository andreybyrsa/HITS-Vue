<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import useUserStore from '@Store/user/userStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import useQuestsStore from '@Store/quests/questsStore'
import useTeamStore from '@Store/teams/teamsStore'
import { Quest, QuestStat, TeamQuestStat, UsersQuestStat } from '@Domain/Quest'
import QuestTableCollapseTeamLevel from './QuestTableCollapseTeamLevel.vue'

import Table from '@Components/Table/Table.vue'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import { TableCollapse } from '@Components/Tables/QuestsTable/QuestTableCollapse.types'

import { OptionType } from '@Components/Inputs/Select/Select.types'

const props = defineProps<TableCollapse>()
const teamQuestStat = ref<TeamQuestStat[]>(props.data.teams)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questsTemplatesStore = useQuestTemplatesStore()
const { questTemplate } = storeToRefs(questsTemplatesStore)

const questsStore = useQuestsStore()
const { quests } = storeToRefs(questsStore)

const teamsStore = useTeamStore()
const { teams } = storeToRefs(teamsStore)

const computedRole = computed(() => {
  return user.value?.role
})

const availableOptions: OptionType[] = [
  {
    value: true,
    label: 'Доступен',
  },
  {
    value: false,
    label: 'Не доступен',
  },
]

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
const launchQuestsTableCollapseDropdownMenuAction: DropdownMenuAction<TeamQuestStat>[] =
  [
    {
      label: 'Отправить всем участникам команды сообщение о прохождении',
      statement: () => true,
      // click: (value: LaunchQuest) => navigateToLaunchQuestModal(value),
      click: () => handleEditCollapseTable,
    },
    // {
    //   label: 'Пройти опрос',
    //   statement: (launchQuest: Quest) => launchQuestPassability(launchQuest),
    //   click: (launchQuest: Quest) => openPassLaunchQuestModal(launchQuest),
    // },
  ]

function getStatusStyle(percent: string) {
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
      :dropdown-actions-menu="launchQuestsTableCollapseDropdownMenuAction"
      :collapse-child-component="QuestTableCollapseTeamLevel"
    >
      <!-- :dropdownActionsMenu="dropdownActionsMenu" -->
    </Table>
  </div>
</template>

<style>
.ps-20 {
  padding-left: 20%;
}
</style>
