<script lang="ts" setup>
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import PassLaunchQuestModal from '@Components/Modals/LaunchQuestModal/PassLaunchQuestModal.vue'
import useUserStore from '@Store/user/userStore'
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'
import { storeToRefs } from 'pinia'
import { LaunchQuest } from '@Domain/Quest'
import { computed, onMounted, ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import LaunchQuestModal from '@Components/Modals/LaunchQuestModal/LaunchQuestModal.vue'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import { bool } from 'yup'
import LaunchQuestTableCollapse from '@Components/Tables/LaunchQuestsTable/LaunchQuestTableCollapse.vue'

const route = useRoute()
const userStore = useUserStore()
const launchQuestStore = useLaunchQuestStore()

const { user } = storeToRefs(userStore)
const { launchQuests } = storeToRefs(launchQuestStore)

const isPassLaunchQuestModalOpen = ref(false)
const passLaunchQuest = ref<LaunchQuest | null>(null)

onMounted(async () => {
  if (user.value?.token) {
    await launchQuestStore.getLaunchQuests(user.value.token)
  }
})

const openPassLaunchQuestModal = (launchQuest: LaunchQuest) => {
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

const getTranslatedIsAvailableStatus = (available: boolean) => {
  return available ? 'Открыт' : 'Завершен'
}

const getTranslatedIsPassedStatus = (passed: boolean) => {
  return passed ? 'Пройден' : 'Не пройден'
}

const launchQuestsTableColumns = computed((): TableColumn<LaunchQuest>[] => {
  const columns: TableColumn<LaunchQuest>[] = [
    {
      key: 'name',
      label: 'Название',
      rowCellClick: (value: LaunchQuest) => navigateToLaunchQuestModal(value),
    },
    {
      key: 'startAt',
      contentClassName: 'justify-content-center align-items-center text-center',
      label: 'Дата начала',
    },
    {
      key: 'endAt',
      contentClassName: 'justify-content-center align-items-center text-center',
      label: 'Дата окончания',
    },
    {
      key: 'percent',
      contentClassName: 'justify-content-center align-items-center text-center',
      label: 'Результат прохождения',
    },
    {
      key: 'available',
      contentClassName: 'justify-content-center align-items-center text-center',
      label: 'Доступ',
      getRowCellFormat: getTranslatedIsAvailableStatus,
    },
  ]

  if (user.value?.role == 'PROJECT_OFFICE') {
    return columns
  }
  columns.push({
    key: 'passed',
    contentClassName: 'justify-content-center align-items-center text-center',
    label: 'Статус',
    getRowCellFormat: getTranslatedIsPassedStatus,
  })
  return columns
})

const launchQuestPassability = (launchQuest: LaunchQuest) => {
  return (
    user.value?.role != 'PROJECT_OFFICE' &&
    !launchQuest.passed &&
    launchQuest.available
  )
}

const launchQuestsTableDropdownMenuAction: DropdownMenuAction<LaunchQuest>[] = [
  {
    label: 'Просмотреть',
    statement: () => true,
    // click: (value: LaunchQuest) => navigateToLaunchQuestModal(value),
    click: () => handleEditCollapseTable,
  },
  {
    label: 'Пройти опрос',
    statement: (launchQuest: LaunchQuest) => launchQuestPassability(launchQuest),
    click: (launchQuest: LaunchQuest) => openPassLaunchQuestModal(launchQuest),
  },
]

const navigateToLaunchQuestModal = (quest: LaunchQuest) => {
  const routeName = route.name
  if (!routeName) return
  const { idLaunchQuest } = quest
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
</script>

<template>
  <Table
    class-name="p-3"
    :header="launchQuestsTableHeader"
    :columns="launchQuestsTableColumns"
    :dropdown-actions-menu="launchQuestsTableDropdownMenuAction"
    :data="launchQuests"
    :search-by="['name']"
    :collapseChildComponent="LaunchQuestTableCollapse"
    :isOpenCollapse="isOpenCollapseTable"
  />
  <PassLaunchQuestModal
    :launch-quest="passLaunchQuest"
    @close-modal="closePassLaunchQuestModal"
    :is-opened="isPassLaunchQuestModalOpen"
  ></PassLaunchQuestModal>
</template>
