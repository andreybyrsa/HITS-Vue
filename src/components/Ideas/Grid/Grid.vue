<script lang="ts" setup>
// import { GridProps, GridEmits } from '@Components/Ideas/Grid/Grid.types'
import Idea from '@Components/Ideas/Idea/Idea.vue'
import { ref, computed } from 'vue'
// в отдельном файле прописать типизацию для пропсов
const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String,
  filteredData: Array,
})

const sortKey = ref('')
// параметр для sortOrders вынести в отдельную функцию
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
    <tr>
      <th
        v-for="(column, index) in translatedColumns"
        @click="sortBy(props.columns[index])"
        :class="{ active: sortKey == props.columns[index] }"
        :key="index"
        :style="{
          cursor:
            props.columns[index] === 'name' || props.columns[index] === 'status'
              ? 'default'
              : 'pointer',
        }"
      >
        {{ column }}
        <span
          v-if="
            props.columns[index] !== 'name' && props.columns[index] !== 'status'
          "
          class="arrow"
          :class="sortOrders[props.columns[index]] > 0 ? 'asc' : 'dsc'"
        >
        </span>
      </th>
    </tr>

    <tbody>
      <tr
        v-for="(entry, index) in filteredData"
        :key="index"
        class="idea w-100 px-4 py-3 text-center border rounded-4 bg-light"
      >
        <td
          v-for="(key, index) in props.columns"
          :key="index"
          class="bg-light"
        >
          <span
            :class="[
              getCellClass(key, entry[key]),
              key === 'status' && entry[key] === 'Утверждено'
                ? 'green'
                : key === 'name' || key === 'updatedDate'
                ? 'blue'
                : '',
            ]"
          >
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
            style="width: 300px"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style lang="scss">
.idea {
  @include gridable(
    2fr 1fr 1fr 100px 100px 100px,
    $gap: 16px,
    $align-items: center
  );
  width: 100%;
}

table {
  border: 0px solid #ffffff;
  border-radius: 10px;
}

th {
  background-color: #0d6efd;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
  font-size: 20px;
  font-weight: normal;
  padding: 6px;
}
th:first-of-type {
  border-radius: 8px 0 0 0;
}

th:last-of-type {
  border-radius: 0 8px 0 0;
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
td .blue {
  color: #2151ff;
}
</style>
