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
import { Quest } from '@Domain/Quest'
import { computed, onMounted, ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import LaunchQuestModal from '@Components/Modals/QuestModal/QuestModal.vue'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import QuestTableCollapse from '@Components/Tables/QuestsTable/QuestTableCollapse.vue'

const route = useRoute()
const userStore = useUserStore()
const QuestStore = useQuestsStore()

const { user } = storeToRefs(userStore)
const { quests: Quests } = storeToRefs(QuestStore)

const isPassLaunchQuestModalOpen = ref(false)
const passLaunchQuest = ref<Quest | null>(null)

onMounted(async () => {
  if (user.value?.token) {
    await QuestStore.getQuests(user.value.token)
  }
})

const openPassLaunchQuestModal = (launchQuest: Quest) => {
  passLaunchQuest.value = launchQuest
  isPassLaunchQuestModalOpen.value = true
}

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

const launchQuestsTableColumns = computed((): TableColumn<Quest>[] => {
  const columns: TableColumn<Quest>[] = [
    {
      key: 'name',
      label: 'Название',
      contentClassName: 'align-self-start',
      rowCellClick: (value: Quest) => navigateToLaunchQuestModal(value),
    },
    // {
    //   key: 'startAt',
    //   contentClassName: 'justify-content-center align-items-center text-center',
    //   label: 'Дата начала',
    // },
    // {
    //   key: 'endAt',
    //   contentClassName: 'justify-content-center align-items-center text-center',
    //   label: 'Дата окончания',
    // },
    {
      key: 'percent',
      contentClassName: 'justify-content-center align-items-center text-center',
      label: 'Результат прохождения',
      getRowCellFormat: getPercentWithSign,
    },
    // {
    //   key: 'available',
    //   contentClassName: 'justify-content-center align-items-center text-center',
    //   label: 'Доступ',
    //   getRowCellFormat: getTranslatedIsAvailableStatus,
    // },
  ]

  if (user.value?.role == 'PROJECT_OFFICE') {
    return columns
  }
  columns.push({
    key: 'passed',
    contentClassName: 'justify-content-center align-items-center text-center ',
    label: 'Статус',
    getRowCellFormat: getTranslatedIsPassedStatus,
  })
  return columns
})

const launchQuestPassability = (launchQuest: Quest) => {
  return (
    user.value?.role != 'PROJECT_OFFICE' &&
    !launchQuest.passed &&
    launchQuest.available
  )
}

const launchQuestsTableDropdownMenuAction: DropdownMenuAction<Quest>[] = [
  {
    label: 'Просмотреть',
    statement: () => true,
    // click: (value: LaunchQuest) => navigateToLaunchQuestModal(value),
    click: () => handleEditCollapseTable,
  },
  {
    label: 'Пройти опрос',
    statement: (launchQuest: Quest) => launchQuestPassability(launchQuest),
    click: (launchQuest: Quest) => openPassLaunchQuestModal(launchQuest),
  },
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

const isOpenCollapseTable = ref(true)

function handleEditCollapseTable() {
  if (isOpenCollapseTable.value) isOpenCollapseTable.value = false
  isOpenCollapseTable.value = true
}

const getPercentWithSign = (precent: string) => {
  return precent + ' %'
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="launchQuestsTableHeader"
    :columns="launchQuestsTableColumns"
    :dropdown-actions-menu="launchQuestsTableDropdownMenuAction"
    :data="Quests"
    :search-by="['name']"
    :collapseChildComponent="QuestTableCollapse"
    :isOpenCollapse="isOpenCollapseTable"
  />
  <PassLaunchQuestModal
    :launch-quest="passLaunchQuest"
    @close-modal="closePassLaunchQuestModal"
    :is-opened="isPassLaunchQuestModalOpen"
  ></PassLaunchQuestModal>
</template>

<style>
.percent::after {
  content: '%';
}
</style>
