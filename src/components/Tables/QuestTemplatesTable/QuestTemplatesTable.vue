<script lang="ts" setup>
import {
  TableColumn,
  TableHeader,
  DropdownMenuAction,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import useUserStore from '@Store/user/userStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import { storeToRefs } from 'pinia'
import { QuestTemplateShort } from '@Domain/Quest'
import { onMounted, ref } from 'vue'
import CreateQuestTemplateModal from '@Components/Modals/QuestTemplateModal/CreateQuestTemplateModal.vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import QuestTemplateModal from '@Components/Modals/QuestTemplateModal/QuestTemplateModal.vue'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const route = useRoute()

const userStore = useUserStore()
const questTemplatesStore = useQuestTemplatesStore()

const { user } = storeToRefs(userStore)
const { questTemplates: quests } = storeToRefs(questTemplatesStore)

const questTemplateIdRef = ref<string | null>(null)

const isQuestModalOpen = ref(false)

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questTemplatesStore.getQuestTemplates(token)
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
  return available ? 'Открыт' : 'Скрыт'
}

const questsTableColumns: TableColumn<QuestTemplateShort>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: (value: QuestTemplateShort) => navigateToQuestModal(value),
  },
  {
    key: 'available',
    label: 'Статус',
    getRowCellFormat: getTranslatedWorkStatus,
  },
]

const questsTableDropdownMenuAction: DropdownMenuAction<QuestTemplateShort>[] = [
  {
    label: 'Просмотреть',
    statement: () => true,
    click: (value: QuestTemplateShort) => navigateToQuestModal(value),
  },
  {
    label: 'Создать копию',
    statement: () => true,
    click: (quest: QuestTemplateShort) => createCopyQuest(quest),
  },
]

const createCopyQuest = (quest: QuestTemplateShort) => {
  questTemplateIdRef.value = quest.idQuestTemplate
  isQuestModalOpen.value = true
}

const createQuest = () => {
  questTemplateIdRef.value = null
  isQuestModalOpen.value = true
}

const closeQuestModal = () => {
  isQuestModalOpen.value = false
}

const navigateToQuestModal = (quest: QuestTemplateShort) => {
  const routeName = route.name
  if (!routeName) return
  const { idQuestTemplate: id } = quest
  const questRoute: RouteRecordRaw = {
    name: 'quest',
    path: '/quests/:id',
    alias: '/quests/:id',
    component: QuestTemplateModal,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute(routeName?.toString(), `/quests/${id}`, questRoute)
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
  <CreateQuestTemplateModal
    :id="questTemplateIdRef"
    :isOpened="isQuestModalOpen"
    @close-modal="closeQuestModal"
  ></CreateQuestTemplateModal>
</template>
