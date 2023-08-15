<script lang="ts" setup>
import { ref, computed } from 'vue'

import { GridProps, GridEmits } from '@Components/Ideas/Grid/Grid.types'
import { Idea } from '@Domain/Idea'
import Button from '@Components/Button/Button.vue'
import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<GridProps>()
// const emit = defineEmits<GridEmits>()

const ideasStore = useIdeasStore()

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

// function handleIdeaData(idea: Idea) {
//   emit('set-idea', idea)
// }

function handleDelete(id: number) {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraXZhQG1haWwuY29tIiwiaWF0IjoxNjkyMTAxNDQ0LCJleHAiOjE2OTIxMDUwNDR9.Kq_Qef1TlmtwQIGspceLicHz1yqHVwV7XEVcnWln5vY'
  ideasStore.deleteInitiatorIdeas(id, token)
}
</script>

<template>
  <table v-if="filteredData?.length">
    <thead>
      <tr class="tr">
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
        <th>Действие</th>
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
        <!-- <router-link :to="`edit-idea/${entry.id}`">
          <Button
            class-name="button btn-primary w-100"
            @click="handleIdeaData(entry)"
            ><i class="bi bi-list fs-1"></i>
          </Button>
        </router-link> -->
        <Button
          class-name="button btn-primary w-100"
          @click="handleDelete(entry.id as number)"
          ><i class="bi bi-trash-fill fs-1"></i>
        </Button>
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
  background-color: #fff;
}

th {
  background-color: #0d6efd;
  color: rgba(255, 255, 255, 0.66);
  padding: 20px 10px;
  cursor: pointer;
  user-select: none;
}

th.active {
  color: #fff;
}

td {
  height: 80px;
  padding: 10px;
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
</style>
