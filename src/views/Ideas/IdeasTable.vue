<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
// import Icon from '@Components/Icon/Icon.vue'
import IdeasMarketServise from '@Services/MarketServise'

import IdeasTableProps from '@Views/Ideas/IdeasView.types'

import { Idea } from '@Domain/Idea'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

import getStatus from '@Utils/getStatus'

const props = defineProps<IdeasTableProps>()

const availableStatus = getStatus()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const [isSorted, setIsSorted] = useToggle(true)

const ideaStore = useIdeasStore()

const gridColumns: TableColumn<Idea>[] = [
  {
    key: 'name',
    label: 'Название',
    className: 'col-3 justify-content-start text-start',
  },
  {
    key: 'status',
    label: 'Статус',
    className: 'col-2',
    getFormat: getTranslatedStatus,
  },
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
    getFormat: (value) => value.toFixed(1),
    getStyle: getRatingColor,
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    getStyle: getRatingColor,
    getFormat: getFloorRating,
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

function getFloorRating(rating: number) {
  return rating.toFixed(1)
}

function getRatingColor(rating: number): string {
  if (rating >= 4.0) {
    return 'text-success'
  }
  if (rating < 4.0 && rating >= 3.0) {
    return 'text-warning'
  }
  return 'text-danger'
}

const ideaId = ref<string>('')
const isOpenedIdeaDeleteModal = ref(false)

function handleOpenDeleteModal(id: string) {
  ideaId.value = id
  isOpenedIdeaDeleteModal.value = true
}
function handleCloseDeleteModal() {
  isOpenedIdeaDeleteModal.value = false
}

async function handleDeleteIdea() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    await ideaStore.deleteInitiatorIdea(ideaId.value, token)
  }
}

function checkButtonDelete(initiator: string) {
  return (user.value?.role == 'INITIATOR' && user.value.email == initiator) ||
    user.value?.role == 'ADMIN'
    ? true
    : false
}

function checkButtonEdit(initiator: string, status: IdeaStatusTypes) {
  return (user.value?.role == 'INITIATOR' &&
    user.value.email == initiator &&
    (status == 'NEW' || status == 'ON_EDITING')) ||
    user.value?.role == 'ADMIN'
    ? true
    : false
}

// function checkMark(row: Idea) {
//   const currentRole = user.value?.role
//   const currentStatusIdea = row.status
//   const currentInitiatorIdea = row.initiator
//   const currentEmail = user.value?.email
//   return currentRole == 'INITIATOR' &&
//     (currentStatusIdea == 'NEW' || currentStatusIdea == 'ON_EDITING') &&
//     currentInitiatorIdea == currentEmail
//     ? true
//     : currentRole == 'PROJECT_OFFICE' &&
//       (currentStatusIdea == 'ON_APPROVAL' || currentStatusIdea == 'CONFIRMED')
//     ? true
//     : currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
//     ? true
//     : false
// }

async function sendData(data: Idea[]) {
  const currentUser = user.value
  console.log(data)
  if (currentUser?.token) {
    const { token } = currentUser
    await IdeasMarketServise.postIdeaOnMarket(data, token)
  }
}

const buttons = ref([
  {
    label: 'Отправить на биржу идей',
    click: (value: Idea[]) => sendData(value),
    statement: true,
  },
])
</script>

<template>
  <Table
    :buttons="buttons"
    :columns="gridColumns"
    :data="ideas"
    :search-value="searchedValue"
  >
    <template #actions="{ item }: { item: Idea }">
      <Button
        type="button"
        class-name="btn-primary"
        prepend-icon-name="bi bi-list"
        v-dropdown="'ideasTable'"
      ></Button>
      <DropDown id="ideasTable">
        <ul class="list-group list-group-flush">
          <li class="list-group-item list-group-item-action p-1">
            <button
              class="w-100 text-start"
              @click="router.push(`/ideas/list/${item.id}`)"
            >
              Просмотреть идею
            </button>
          </li>
          <li
            v-if="checkButtonEdit(item.initiator, item.status)"
            class="list-group-item list-group-item-action p-1"
          >
            <button
              class="w-100 text-start"
              @click="router.push(`/ideas/edit/${item.id}`)"
            >
              Редактировать
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
    <!-- <template
      v-if="user?.role != 'ADMIN'"
      #icon="{ item }: { item: Idea }"
    >
      <Icon
        v-if="checkMark(item)"
        class-name="bi bi-circle-fill text-success bg-transparent fs-6"
      />
      <Icon
        v-else
        class-name="bi bi-circle-fill text-secondary bg-transparent fs-6 opacity-25"
      />
    </template> -->
  </Table>

  <DeleteModal
    :is-opened="isOpenedIdeaDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteIdea"
  />
</template>
