<script lang="ts" setup>
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import PassQuestModal from '@Components/Modals/QuestModal/PassQuestModal.vue'
import useUserStore from '@Store/user/userStore'
import useQuestsStore from '@Store/quests/questsStore'
import { storeToRefs } from 'pinia'
import { QuestStat } from '@Domain/Quest'
import { computed, onMounted } from 'vue'
import QuestTableCollapse from '@Components/Tables/QuestsTable/QuestTableCollapse.vue'
import useQuestResultsStore from '@Store/questResults/questResultsStore'
import { RouteRecordRaw, useRoute } from 'vue-router'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questStore = useQuestsStore()

const questsStore = useQuestsStore()
const { quests } = storeToRefs(questsStore)

const questResultsStore = useQuestResultsStore()

onMounted(async () => {
  const { id, role, token } = { ...user.value }
  if (!id || !role || !token) return
  if (role == 'PROJECT_OFFICE') {
    await questStore.getQuestsForProjectOffice(token)
  } else {
    await questStore.getQuests(id, token)
  }
})

const launchQuestsTableHeader: TableHeader = {
  label: 'Запущенные опросы',
  countData: true,
}

const launchQuestsTableColumns = computed((): TableColumn<QuestStat>[] => {
  const columns: TableColumn<QuestStat>[] = [
    {
      key: 'name',
      label: 'Название',
      contentClassName: 'col align-self-start',
    },
    {
      key: 'progress',
      contentClassName: 'col justify-content-center align-items-center text-center ',
      label: 'Результат прохождения',
      getRowCellFormat: getFormatProgress,
    },
  ]

  if (user.value?.role == 'PROJECT_OFFICE') {
    return columns
  }
  return columns
})

const isProjectOffice = () => {
  return user.value?.role == 'PROJECT_OFFICE'
}

const canPassQuest = (questStat: QuestStat) => {
  if (!user.value?.role) return false
  const isAcceptedRole = ['INITIATOR', 'TEAM_LEADER', 'MEMBER', 'TEACHER'].includes(
    user.value?.role,
  )

  return isAcceptedRole && !questStat.isPass
}

const launchQuestsTableDropdownMenuAction: DropdownMenuAction<QuestStat>[] = [
  {
    label: 'Отправить напоминание о прохождении опроса',
    statement: isProjectOffice,
    click: (questStat: QuestStat) => sendNotifications(questStat),
  },
  {
    label: 'Скачать результаты опроса',
    statement: isProjectOffice,
    click: (questStat: QuestStat) => downloadQuestResults(questStat.idQuest),
  },
  {
    label: 'Пройти опрос',
    statement: (questStat: QuestStat) => canPassQuest(questStat),
    click: (quest: QuestStat) => navigateToQuestModal(quest),
  },
]

const getFormatProgress = (progress: string) => {
  return Math.floor(parseFloat(progress)).toString() + ' %'
}

const sendNotifications = async (quest: QuestStat) => {
  const token = user.value?.token
  if (!token) return
  await questsStore.sendNotifications(quest.idQuest, token)
}

const downloadQuestResults = async (idQuest: string) => {
  const token = user.value?.token
  if (!token) return
  await questResultsStore.downloadResults(idQuest, token)
}

const navigateToQuestModal = (quest: QuestStat) => {
  const routeName = route.name
  if (!routeName) return
  const { idQuest } = quest
  const questRoute: RouteRecordRaw = {
    name: 'quest',
    path: '/quest/:id',
    alias: '/quest/:id',
    component: PassQuestModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(routeName?.toString(), `/quest/${idQuest}`, questRoute)
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="launchQuestsTableHeader"
    :columns="launchQuestsTableColumns"
    :dropdown-actions-menu="launchQuestsTableDropdownMenuAction"
    :data="quests ?? []"
    :search-by="['name']"
    :collapseChildComponent="QuestTableCollapse"
  />
</template>

<style></style>
