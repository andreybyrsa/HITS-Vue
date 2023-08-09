<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String,
})

const sortKey = ref('')
const sortOrders = ref(props.columns.reduce((o, key) => ((o[key] = 1), o), {}))

const filteredData = computed(() => {
  let { data, filterKey } = props
  if (filterKey) {
    filterKey = filterKey.toLowerCase()
    data = data.filter((row) => {
      return Object.keys(row).some((key) => {
        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
      })
    })
  }
  const key = sortKey.value
  if (key) {
    const order = sortOrders.value[key]
    data = data.slice().sort((a, b) => {
      a = a[key]
      b = b[key]
      return (a === b ? 0 : a > b ? 1 : -1) * order
    })
  }
  return data
})

function sortBy(key) {
  if (key === 'name' || key === 'status') return
  sortKey.value = key
  sortOrders.value[key] *= -1
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const translatedColumns = computed(() => props.columns.map(translate))

function translate(word) {
  const translations = {
    name: 'Название',
    status: 'Статус',
    creationDate: 'Дата создания',
    updatedDate: 'Дата редактирования',
    rating: 'Рейтинг',
    risk: 'Риск',
  }
  return translations[word] || word
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('ru-RU', options)
}

function getCellClass(key, value) {
  if (key === 'rating' || key === 'risk') {
    if (value >= 4) return 'green'
    else if (value >= 3 && value < 4) return 'orange'
    else return 'red'
  }
  return ''
}
</script>

<template>
  <table v-if="filteredData.length">
    <thead>
      <tr>
        <th
          v-for="(column, index) in translatedColumns"
          @click="sortBy(props.columns[index])"
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
            :class="sortOrders[props.columns[index]] > 0 ? 'asc' : 'dsc'"
          >
          </span>
        </th>
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
          <span :class="getCellClass(key, entry[key])">
            {{
              key === 'creationDate' || key === 'updatedDate'
                ? formatDate(entry[key])
                : entry[key]
            }}
          </span>
        </td>
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
          >
            {{ column }}
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style>
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
</style>
