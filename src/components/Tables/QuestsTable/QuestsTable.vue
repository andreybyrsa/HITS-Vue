<script lang="ts" setup>
import {
  TableColumn,
  TableHeader,
  DropdownMenuAction,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import useUserStore from '@Store/user/userStore'
import useQuestsStore from '@Store/quests/questsStore'
import { storeToRefs } from 'pinia'
import { QuestShort } from '@Domain/Quest'
import { onMounted, ref } from 'vue'
import CreateQuestModal from '@Components/Modals/QuestModal/CreateQuestModal.vue'
import { RouteRecordRaw, useRouter, useRoute } from 'vue-router'
import QuestModal from '@Components/Modals/QuestModal/QuestModal.vue'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const questStore = useQuestsStore()

const { user } = storeToRefs(userStore)
const { quests } = storeToRefs(questStore)

const questIdRef = ref<string | null>(null)

const isQuestModalOpen = ref(false)

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questStore.getQuests(token)
  }
})

const questsTableHeader: TableHeader = {
  label: 'Шаблоны опросов',
  countData: true,
  buttons: [
    {
      label: 'Создать шаблон опроса',
      variant: 'primary',
      statement: true,
      click: () => createQuest(),
    },
  ],
}

const getTranslatedWorkStatus = (available: boolean) => {
  return available ? 'Открыт' : 'Завершен'
}

const questsTableColumns: TableColumn<QuestShort>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: (value: QuestShort) => navigateToQuestModal(value),
  },
  {
    key: 'available',
    label: 'Статус',
    getRowCellFormat: getTranslatedWorkStatus,
  },
]

const questsTableDropdownMenuAction: DropdownMenuAction<QuestShort>[] = [
  {
    label: 'Просмотреть',
    statement: () => true,
    click: (value: QuestShort) => navigateToQuestModal(value),
  },
  {
    label: 'Создать копию',
    statement: () => true,
    click: (quest: QuestShort) => createCopyQuest(quest),
  },
]

const createCopyQuest = (quest: QuestShort) => {
  questIdRef.value = quest.idQuest
  isQuestModalOpen.value = true
}

const createQuest = () => {
  questIdRef.value = null
  isQuestModalOpen.value = true
}

const closeQuestModal = () => {
  isQuestModalOpen.value = false
}

const navigateToQuestModal = (quest: QuestShort) => {
  const { idQuest, name } = quest
  const questRoute: RouteRecordRaw = {
    name: 'quest',
    path: '/quests/:idQuest',
    alias: '/quests/:idQuest',
    component: QuestModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(name, `/quests/${idQuest}`, questRoute)
}
</script>

<template>
  <Table
    class-name="p-3"
    :header="questsTableHeader"
    :columns="questsTableColumns"
    :dropdown-actions-menu="questsTableDropdownMenuAction"
    :data="quests"
    :search-by="['name']"
  />
  <CreateQuestModal
    v-if="isQuestModalOpen"
    :idQuest="questIdRef"
    :isOpened="isQuestModalOpen"
    @close-modal="closeQuestModal"
  ></CreateQuestModal>
</template>
