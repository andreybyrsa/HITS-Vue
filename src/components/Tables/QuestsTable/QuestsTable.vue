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
import { QuestStat } from '@Domain/Quest'
import { computed, onMounted, ref } from 'vue'
import QuestTableCollapse from '@Components/Tables/QuestsTable/QuestTableCollapse.vue'
import useQuestResultsStore from '@Store/questResults/questResultsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const QuestStore = useQuestsStore()

const questsStore = useQuestsStore()

const questResultsStore = useQuestResultsStore()

const questCollapseData = ref<QuestStat[]>()
const isPassLaunchQuestModalOpen = ref(false)
const passLaunchQuest = ref<QuestStat | null>(null)

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

const isNotProjectOffice = () => {
  return user.value?.role != 'PROJECT_OFFICE'
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
    click: (questStat: QuestStat) => downloadQuestResults(questStat.id),
  },
  {
    label: 'Пройти опрос',
    statement: isNotProjectOffice,
    click: (quest: QuestStat) => openPassLaunchQuestModal(quest),
  },
]

const openPassLaunchQuestModal = (quest: QuestStat) => {
  passLaunchQuest.value = quest
  isPassLaunchQuestModalOpen.value = true
}

const getFormatProgress = (progress: string) => {
  return Math.floor(parseFloat(progress)).toString() + ' %'
}

const sendNotifications = async (quest: QuestStat) => {
  const token = user.value?.token
  if (!token) return
  await questsStore.sendNotifications(quest.id, token)
}

const downloadQuestResults = async (idQuest: string) => {
  const token = user.value?.token
  if (!token) return
  await questResultsStore.downloadResults(idQuest, token)
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
    v-if="passLaunchQuest?.id"
    :id-quest="passLaunchQuest?.id"
    @close-modal="closePassLaunchQuestModal"
    :is-opened="isPassLaunchQuestModalOpen"
  ></PassLaunchQuestModal>
</template>

<style></style>
