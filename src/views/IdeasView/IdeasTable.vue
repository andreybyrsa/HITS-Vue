<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import { Idea } from '@Domain/Idea'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import IdeasTableProps from '@Views/IdeasView/IdeasView.types'

import getStatus from '@Utils/getStatus'

defineProps<IdeasTableProps>()

const isOpenedIdeaModal = ref(false)

const currentOpenedIdea = ref<Idea>()

const availableStatus = getStatus()

const gridColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Название',
    className: 'col-5 justify-content-start text-start',
    click: () => console.log(1),
  },
  { key: 'status', label: 'Статус', getFormat: getTranslatedStatus },
  { key: 'dateCreated', label: 'Дата создания', getFormat: getFormattedDate },
  { key: 'dateModified', label: 'Дата изменения', getFormat: getFormattedDate },
  { key: 'rating', label: 'Рейтинг', getStyle: getRatingColor },
]

function getTranslatedStatus(status: IdeaStatusTypes) {
  return availableStatus.translatedStatus[status]
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getRatingColor(rating: number) {
  if (rating >= 4.0) {
    return 'text-success'
  }
  if (rating < 4.0 && rating >= 3.0) {
    return 'text-warning'
  }
  return 'text-danger'
}

function handleOpenIdeaModal(idea: Idea) {
  currentOpenedIdea.value = idea
  isOpenedIdeaModal.value = true
}

function handleCloseIdeaModal() {
  isOpenedIdeaModal.value = false
}
</script>

<template>
  <Table
    :columns="gridColumns"
    :data="ideas"
    :search-value="searchedValue"
  >
    <template #actions="{ item }: { item: Idea }">
      <Button
        type="button"
        class-name="btn-primary"
        prepend-icon-name="bi bi-list"
        is-drop-down-controller
      ></Button>
      <DropDown>
        <ul class="list-group list-group-flush">
          <li class="list-group-item list-group-item-action p-1">
            <button
              class="w-100 text-start"
              @click="handleOpenIdeaModal(item)"
            >
              Просмотреть идею
            </button>
          </li>
        </ul>
      </DropDown>
    </template>
  </Table>

  <IdeaModal
    :is-opened="isOpenedIdeaModal"
    :idea="currentOpenedIdea"
    @close-modal="handleCloseIdeaModal"
  />
</template>
