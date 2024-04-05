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
import CreateQuestModal from '@Components/Modals/CreateQuestModal/CreateQuestModal.vue'

const userStore = useUserStore()
const questStore = useQuestsStore()

const { user } = storeToRefs(userStore)
const { questsShort: quests } = storeToRefs(questStore)

const questIdRef = ref<string | null>(null)

const isQuestModalOpen = ref(false)

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questStore.getQuests(token)
    console.log(questStore.getQuests(token))
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
    click: (value: QuestShort) => value,
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
