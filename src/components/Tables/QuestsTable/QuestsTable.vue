<script lang="ts" setup>
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import PassLaunchQuestModal from '@Components/Modals/QuestModal/PassQuestModal.vue'
import useUserStore from '@Store/user/userStore'
import useQuestsStore from '@Store/quests/questsStore'
import { storeToRefs } from 'pinia'
import { Quest, QuestStat } from '@Domain/Quest'
import { computed, onMounted, ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import LaunchQuestModal from '@Components/Modals/QuestModal/QuestModal.vue'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import QuestTableCollapse from '@Components/Tables/QuestsTable/QuestTableCollapse.vue'

const route = useRoute()
const userStore = useUserStore()
const QuestStore = useQuestsStore()
const questCollapseData = ref<QuestStat[]>()

const { user } = storeToRefs(userStore)
// const { quests: Quests } = storeToRefs(QuestStore)

const isPassLaunchQuestModalOpen = ref(false)
const passLaunchQuest = ref<Quest | null>(null)

onMounted(async () => {
  const token = user.value?.token
  if (!token) return
  await QuestStore.getQuests(token)

  const response = await QuestStore.getQuestCollapseData(token)
  if (response instanceof Error) return
  questCollapseData.value = response
})

const closePassLaunchQuestModal = () => {
  passLaunchQuest.value = null
  isPassLaunchQuestModalOpen.value = false
}

const launchQuestsTableHeader: TableHeader = {
  label: 'Запущенные опросы',
  countData: true,
}

const getTranslatedIsPassedStatus = (passed: boolean) => {
  return passed ? 'Пройден' : 'Не пройден'
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
  // columns.push({
  //   key: 'passed',
  //   contentClassName: 'justify-content-center align-items-center text-center ',
  //   label: 'Статус',
  //   getRowCellFormat: getTranslatedIsPassedStatus,
  // })
  return columns
})

const launchQuestPassability = (launchQuest: QuestStat) => {
  return (
    user.value?.role != 'PROJECT_OFFICE'
    // &&
    // !launchQuest.passed &&
    // launchQuest.available
  )
}

const launchQuestsTableDropdownMenuAction: DropdownMenuAction<QuestStat>[] = [
  {
    label: 'Просмотреть',
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

const navigateToLaunchQuestModal = (quest: Quest) => {
  const routeName = route.name
  if (!routeName) return
  const { idQuest: idLaunchQuest } = quest
  const questRoute: RouteRecordRaw = {
    name: 'launch-quest',
    path: '/launch-quests/:idLaunchQuest',
    alias: '/launch-quests/:idLaunchQuest',
    component: LaunchQuestModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(
    routeName?.toString(),
    `/launch-quests/${idLaunchQuest}`,
    questRoute,
  )
}

const getFormatProgress = (progress: string) => {
  return Math.floor(parseFloat(progress)).toString() + ' %'
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="launchQuestsTableHeader"
    :columns="launchQuestsTableColumns"
    :dropdown-actions-menu="launchQuestsTableDropdownMenuAction"
    :data="questCollapseData ?? []"
    :search-by="['name']"
    :collapseChildComponent="QuestTableCollapse"
  />
  <PassLaunchQuestModal
    :launch-quest="passLaunchQuest"
    @close-modal="closePassLaunchQuestModal"
    :is-opened="isPassLaunchQuestModalOpen"
  ></PassLaunchQuestModal>
</template>

<style></style>
