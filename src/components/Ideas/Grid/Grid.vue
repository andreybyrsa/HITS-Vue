<script lang="ts" setup>
import { ref, computed } from 'vue'

import { GridProps } from '@Components/Ideas/Grid/Grid.types'
import useIdeasStore from '@Store/ideas/ideasStore'
import { Idea } from '@Domain/Idea'
import Button from '@Components/Button/Button.vue'

const props = defineProps<GridProps>()

type O = {
  creationDate?: number
  name?: number
  rating?: number
  risk?: number
  status?: number
  updatedDate?: number
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

console.log(sortOrders.value)

const filteredData = computed(() => {
  let { data, filterKey } = props
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
    return date.toLocaleDateString('ru-RU', options)
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

const ideasStore = useIdeasStore()

function handleDelete(id: number) {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc2RmZnNAbWFpbC5jb20iLCJpYXQiOjE2OTE5MzcyNjcsImV4cCI6MTY5MTk0MDg2N30.6IfqPZtIvQGLbaJQjLXT31sEMkDEzza3sQB2pjX3MBI'
  ideasStore.deleteInitiatorIdeas(id, token)
}
</script>

<template>
  <table v-if="filteredData?.length">
    <thead>
      <tr>
        <th
          v-for="(column, index) in translatedColumns"
          @click="sortBy(props.columns[index] as OType)"
          :class="{ active: sortKey == props.columns[index] }"
          :key="index"
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
        <div class="column-delete">Действие</div>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(entry, index) in filteredData"
        :key="index"
      >
        <td
          v-for="(key, index) in props.columns"
          :key="index"
        >
          <span :class="getCellClass(key, entry[key as IdeaType] as number)">
            {{
              key === 'creationDate' || key === 'updatedDate'
                ? formatDate(entry[key as IdeaType] as Date)
                : entry[key as IdeaType]
            }}
          </span>
        </td>
        <Button
          class-name="btn-primary"
          @click="handleDelete(entry.id as number)"
          ><i class="bi bi-trash-fill"></i
        ></Button>
      </tr>
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

<style lang="scss">
table {
  border: 2px solid #ffffff;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #0026ff;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
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
.column-delete {
  @include flexible(center, center);
  height: 44px;
  background-color: #0026ff;
  color: rgb(255, 255, 255);
}
</style>
