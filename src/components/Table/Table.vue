<script lang="ts" setup>
import { computed } from 'vue'
import TableProps from '@Components/Table/Table.types'

const props = defineProps<TableProps>()

const searchedValue = computed(() => {
  return props.data.filter((element) => {
    const elementData = element.name.toLowerCase().trim()
    const currentSearchedValue = props.searchValue.toLowerCase().trim()

    const isIncludesSearcheValue = elementData.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})
</script>

<template>
  <div class="table w-100">
    <div class="row w-100 text-center bg-primary text-light p-4 rounded-3 fs-4">
      <div
        class="header-element col d-flex justify-content-center"
        v-for="column in columns"
        :key="column.key"
        @click="column.click"
      >
        {{ column.label }}
        <i
          class="header-click bi bi-arrow-down-up bg-primary text-light"
          v-if="column.click"
        ></i>
      </div>
      <div
        v-if="$slots.actions"
        class="col-1"
      >
        Действия
      </div>
    </div>
    <div
      class="row d-flex align-items-center justify-content-center w-100 text-center bg-light p-4 rounded-4 border border-2 fs-5"
      v-for="(row, index) in searchedValue"
      :key="index"
    >
      <div
        class="cell-el col d-flex text-dark align-items-center justify-content-center"
        v-for="column in columns"
        :key="column.key"
      >
        {{ row[column.key] }}
      </div>
      <div
        v-if="$slots.actions"
        class="d-flex justify-content-center col-1"
      >
        <slot
          :item="row"
          name="actions"
        >
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cell-el {
  max-height: 100px;
  overflow-y: auto;
}

.table {
  @include flexible(center, center, column, $gap: 8px);
}

.header-click {
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
