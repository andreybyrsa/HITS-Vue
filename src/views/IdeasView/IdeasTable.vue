<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'
import DeleteIdeaModal from '@Components/Modals/DeleteIdeaModal/DeleteModal.vue'

import IdeasTableProps from '@Views/IdeasView/IdeasView.types'

import { Idea } from '@Domain/Idea'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import useUserStore from '@Store/user/userStore'

import getStatus from '@Utils/getStatus'

const props = defineProps<IdeasTableProps>()

const isOpenedIdeaModal = ref(false)

const currentOpenedIdea = ref<Idea>()

const availableStatus = getStatus()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const [isSorted, setIsSorted] = useToggle(true)

const gridColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Название',
    className: 'col-4 justify-content-start text-start',
  },
  { key: 'status', label: 'Статус', getFormat: getTranslatedStatus },
  {
    key: 'createdAt',
    label: 'Дата создания',
    getFormat: getFormattedDate,
    click: () => sortDateCreated(props.ideas),
  },
  {
    key: 'modifiedAt',
    label: 'Дата изменения',
    getFormat: getFormattedDate,
    click: () => sortDateModified(props.ideas),
  },
  {
    key: 'preAssessment',
    label: 'Оценка',
    getStyle: getRatingColor,
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    getStyle: getRatingColor,
    click: () => sortRating(props.ideas),
  },
]

function sortRating(ideas: Idea[]) {
  ideas.sort((a, b) => {
    if (a.rating == b.rating) {
      const A = new Date(a.createdAt).getTime()
      const B = new Date(b.createdAt).getTime()
      return A - B
    } else return isSorted.value ? a.rating - b.rating : b.rating - a.rating
  })
  setIsSorted()
}

function sortDateModified(ideas: Idea[]) {
  ideas.sort((a, b) => {
    const A = new Date(a.modifiedAt).getTime()
    const B = new Date(b.modifiedAt).getTime()
    return isSorted.value ? B - A : A - B
  })
  setIsSorted()
}

function sortDateCreated(ideas: Idea[]) {
  ideas.sort((a, b) => {
    const A = new Date(a.createdAt).getTime()
    const B = new Date(b.createdAt).getTime()
    return isSorted.value ? B - A : A - B
  })
  setIsSorted()
}

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

const currentOpenedDeleteIdea = ref('')
const isOpenedIdeaDeleteModal = ref(false)

function handleOpenDeleteModal(ideaId: string) {
  currentOpenedDeleteIdea.value = ideaId
  isOpenedIdeaDeleteModal.value = true
}
function handleCloseDeleteModal() {
  isOpenedIdeaDeleteModal.value = false
}

function checkButtonDelete(email: string) {
  return (user.value?.role == 'INITIATOR' && user.value.email == email) ||
    user.value?.role == 'ADMIN'
    ? true
    : false
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
          <li
            v-if="checkButtonDelete(item.initiator)"
            class="list-group-item list-group-item-action p-1"
          >
            <button
              class="w-100 text-start text-danger"
              @click="handleOpenDeleteModal(item.id)"
            >
              Удалить
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
  <DeleteIdeaModal
    :ideaId="currentOpenedDeleteIdea"
    :is-opened="isOpenedIdeaDeleteModal"
    @close-modal="handleCloseDeleteModal"
  />
</template>
