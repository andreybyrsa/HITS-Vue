<template>
  <Table
    class-name="p-3"
    :header="tagsTableHeader"
    :columns="tagTableColumns"
    :data="tags"
    :search-by="['name']"
    :filters="tagsFilters"
    :dropdown-actions-menu="dropdownTagsActions"
  />

  <TagModal
    :is-opened="isOpenCreatingTagModal"
    v-model="tags"
    @close-modal="closeCreatingTagModal"
  />

  <TagModal
    :is-opened="isOpenUpdatingTagModal"
    :tag="updatingTag"
    v-model="tags"
    @close-modal="closeUpdatingTagModal"
  />

  <DeleteModal
    :is-opened="isOpenedDeletingModal"
    :item-name="currentDeleteTagName"
    @close-modal="closeDeletingModal"
    @delete="handleDeleteTag"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import TagsService from '@Services/TagsService'
import { Tag } from '@Domain/Tag'

import Table from '@Components/Table/Table.vue'
import TagModal from '@Components/Modals/TagModal/TagModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

const tags = defineModel<Tag[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const filterByIsConfirmed = ref<boolean>()

const updatingTag = ref<Tag | null>(null)
const currentDeleteTagId = ref<string | null>(null)
const currentDeleteTagName = ref<string>()

const isOpenCreatingTagModal = ref(false)
const isOpenUpdatingTagModal = ref(false)
const isOpenedDeletingModal = ref(false)

const tagsFilters: Filter<Tag>[] = [
  {
    category: 'Статус',
    choices: [
      { label: 'Утверждена', value: true },
      { label: 'На рассмотрении', value: false },
    ],
    refValue: filterByIsConfirmed,
    isUniqueChoice: true,
    checkFilter: checkTagConfirmed,
  },
]

function checkTagConfirmed(tag: Tag, value: FilterValue) {
  return tag.confirmed === value
}

const tagsTableHeader: TableHeader = {
  label: 'Список тегов',
  countData: true,
  buttons: [
    {
      label: 'Добавить тег',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: openCreatingTagModal,
    },
  ],
}

const tagTableColumns: TableColumn<Tag>[] = [
  {
    key: 'color',
    label: 'Цвет',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyleCSS: getCkeckedTagStyleCSS,
    getRowCellStyle: getCkeckedTagStyle,
  },
  {
    key: 'name',
    label: 'Название',
    size: 'col-5',
    rowCellClick: openUpdatingTagModal,
  },
  {
    key: 'confirmed',
    label: 'Статус',
    size: 'col-5',
    getRowCellFormat: getTagStatusFormat,
    getRowCellStyle: getTagStatusStyle,
  },
]

const dropdownTagsActions: DropdownMenuAction<Tag>[] = [
  {
    label: 'Редактировать',
    statement: (tag) => checkTagConfirmed(tag, true),
    click: openUpdatingTagModal,
  },
  {
    label: 'Утвердить',
    statement: (tag) => checkTagConfirmed(tag, false),
    click: handleConfirmTag,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeletingModal,
  },
]

function getTagStatusStyle(isConfirmed: boolean) {
  if (!isConfirmed) {
    return 'text-danger'
  }
}

function getTagStatusFormat(isConfirmed: boolean) {
  if (isConfirmed) {
    return 'Утверждено'
  }
  return 'На рассмотрении'
}

function getCkeckedTagStyleCSS(color: Tag[keyof Tag]) {
  return { color: `${color}` }
}

function getCkeckedTagStyle() {
  const initialClass = ['bi bi-circle-fill', 'fs-6', 'mt-1']

  return initialClass
}

async function handleConfirmTag(tag: Tag) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = tag
    const response = await TagsService.confirmTag(
      { ...tag, confirmed: true },
      id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentTag = tags.value.find((tag) => tag.id === id)

    if (currentTag) {
      currentTag.confirmed = true
    }
  }
}

const handleDeleteTag = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentDeleteTagId.value !== null) {
    const { token } = currentUser
    const response = await TagsService.deleteTag(currentDeleteTagId.value, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentTagIndex = tags.value.findIndex(
      (tag) => tag.id === currentDeleteTagId.value,
    )

    if (currentTagIndex !== -1) {
      tags.value.splice(currentTagIndex, 1)
    }
  }
}

function openCreatingTagModal() {
  isOpenCreatingTagModal.value = true
}
function closeCreatingTagModal() {
  isOpenCreatingTagModal.value = false
}

function openUpdatingTagModal(tag: Tag) {
  updatingTag.value = tag
  isOpenUpdatingTagModal.value = true
}
function closeUpdatingTagModal() {
  isOpenUpdatingTagModal.value = false
}

function openDeletingModal(tag: Tag) {
  currentDeleteTagId.value = tag.id
  currentDeleteTagName.value = tag.name
  isOpenedDeletingModal.value = true
}

function closeDeletingModal() {
  isOpenedDeletingModal.value = false
}
</script>

<style scoped lang="scss"></style>
