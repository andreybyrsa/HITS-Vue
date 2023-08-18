<script lang="ts" setup>
import { ref, computed } from 'vue'

import { GridProps } from '@Components/Ideas/Grid/Grid.types'
import DropDown from '@Components/DropDown/DropDown.vue'
import Button from '@Components/Button/Button.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import StatusTypes from '@Domain/Status'
import { Idea } from '@Domain/Idea'

import getStatus from '@Utils/getStatus'

const props = defineProps<GridProps>()

type O = {
  dateCreated?: number
  name?: number
  rating?: number
  risk?: number
  status?: number
  dateModified?: number
}

type OType = keyof O
type IdeaType = keyof Idea

const sortKey = ref<OType>()
const sortOrders = ref<O>(
  props.columns.reduce((o, key) => {
    o[key as OType] = 1
    return o
  }, {} as O),
)

const filteredData = computed(() => {
  let { data, filterKey, selectedFilters } = props
  if (filterKey) {
    filterKey = filterKey.toLowerCase()
    data = data?.filter((row) => {
      return Object.keys(row).some((key) => {
        return filterKey
          ? String(row[key as IdeaType])
              .toLowerCase()
              .indexOf(filterKey) > -1
          : undefined
      })
    })
  }
  const key = sortKey.value
  if (key) {
    const order = sortOrders.value[key]
    data = data?.slice().sort((a, b) => {
      type ideaKey = keyof typeof a
      const A = a[key as ideaKey]
      const B = b[key as ideaKey]
      return order && A && B ? (A === B ? 0 : A > B ? 1 : -1) * order : 0
    })
  }
  if (selectedFilters?.length) {
    const dataFilter: Idea[] = []
    data?.forEach(
      (elem) =>
        selectedFilters?.every((filter) =>
          Object.values(elem).includes(filter),
        ) && dataFilter.push(elem),
    )
    return dataFilter
  }
  return data
})

function sortBy(key: OType) {
  if (key === 'name' || key === 'status') return
  sortKey.value = key
  if (sortOrders.value[key] && sortOrders.value) {
    sortOrders.value[key] = sortOrders.value[key] == -1 ? 1 : -1
  }
}

const translations = {
  name: 'Название',
  status: 'Статус',
  dateCreated: 'Дата создания',
  dateModified: 'Дата редактирования',
  rating: 'Рейтинг',
  risk: 'Риск',
}

type Word = keyof typeof translations

function translate(word: Word) {
  return translations[word] || word
}

const translatedColumns = computed(() =>
  props.columns.map((word) => translate(word as Word)),
)

function formatDate(date: Date) {
  if (date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(date).toLocaleDateString('ru-RU', options)
  }
}

function getCellClass(key: string, value: number) {
  if (key === 'rating' || key === 'risk') {
    if (value >= 4) return 'green'
    else if (value >= 3 && value < 4) return 'orange'
    else return 'red'
  }
  return ''
}

const statuses = getStatus()

function getTranslatedStatus(status: StatusTypes) {
  return statuses.translatedStatus[status]
}

const isOpenedIdeaModal = ref(false)
const currentOpenedIdea = ref<Idea>()

function handleOpenModal(ideaId: number) {
  isOpenedIdeaModal.value = true
  currentOpenedIdea.value = props.data?.find((idea) => idea.id === ideaId)
}

function handleCloseModal() {
  isOpenedIdeaModal.value = false
}
function getTranslatedKey(entry: Idea, key: string) {
  if (key === 'status') {
    return getTranslatedStatus(entry[key])
  }
  if (key === 'dateCreated' || key === 'dateModified') {
    return formatDate(entry[key])
  }
  return entry[key as IdeaType]
}
</script>

<template>
  <table
    v-if="filteredData?.length"
    class="table-header"
  >
    <thead>
      <tr>
        <th
          v-for="(column, index) in translatedColumns"
          @click="sortBy(props.columns[index] as OType)"
          :class="{ active: sortKey == props.columns[index] }"
          :key="index"
          class="fs-5"
        >
          {{ column }}
          <span
            v-if="
              props.columns[index] !== 'name' &&
              props.columns[index] !== 'status'
            "
            class="arrow"
            :class="sortOrders[props.columns[index] as OType] == 1 ? 'asc' : 'dsc'"
          >
          </span>
        </th>
        <th class="fs-5">Действие</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(entry, index) in filteredData"
        :key="index"
        class="fs-5 border"
      >
        <td
          v-for="(key, index) in props.columns"
          :key="index"
        >
          <span :class="getCellClass(key, entry[key as IdeaType] as number)">
            {{ getTranslatedKey(entry, key) }}
          </span>
        </td>

        <Button
          type="button"
          class-name=" button btn-primary w-100"
          is-drop-down-controller
        >
          <i class="bi bi-list fs-1"></i>
        </Button>
        <DropDown>
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action rounded-3">
              <button
                class="w-100 text-start"
                @click="handleOpenModal(entry.id)"
              >
                Просмотреть идею
              </button>
            </li>

            <li class="list-group-item list-group-item-action rounded-3">
              <router-link
                class="w-100 d-flex text-decoration-none text-dark"
                :to="`edit-idea/${entry.id}`"
              >
                Редактировать
              </router-link>
            </li>

            <li class="list-group-item list-group-item-action rounded-3">
              <router-link
                class="w-100 d-flex text-decoration-none text-dark"
                :to="`edit-idea/${entry.id}`"
              >
                Отправить на согласование
              </router-link>
            </li>
          </ul>
        </DropDown>
      </tr>

      <IdeaModal
        :is-opened="isOpenedIdeaModal"
        :idea="currentOpenedIdea"
        @close-modal="handleCloseModal"
      />
    </tbody>
  </table>

  <div
    v-else
    class="no-data"
  >
    <table>
      <thead>
        <tr>
          <th
            v-for="(column, index) in translatedColumns"
            :key="index"
            class="w-100"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  background-color: #fff;
}

th {
  background-color: #0d6efd;
  color: rgba(255, 255, 255, 0.66);
  padding: 20px 10px;
  cursor: pointer;
  user-select: none;
  text-align: center;
}

td:first-of-type {
  text-align: start;
}

th:last-of-type {
  border-radius: 0 8px 0 0;
}

th:first-of-type {
  border-radius: 8px 0 0 0;
}

th.active {
  color: #fff;
}

td {
  height: 80px;
  padding: 10px;
  text-align: center;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

th.active .arrow {
  opacity: 1;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

td .green {
  color: green;
}
td .orange {
  color: orange;
}
td .red {
  color: red;
}

.button {
  height: 80px;
  transform: scale(0.6);
}
.drop-down {
  @include flexible(flex-start, center, column);
}
</style>
