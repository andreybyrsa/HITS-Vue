<script lang="ts" setup>
import { computed } from 'vue'

import { TableProps } from '@Components/Table/Table.types'

const props = defineProps<TableProps>()

const searchedValue = computed(() => {
  return props.data.filter((element) => {
    const elementData = element.name.toLowerCase().trim()
    const currentSearchedValue = props.searchValue.toLowerCase().trim()

    const isIncludesSearcheValue = elementData.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})

function getCellStyle(styleFunction?: (value: any) => string, value?: any) {
  let CellClass = 'table__row-cell col '
  if (styleFunction) {
    CellClass += styleFunction(value)
  }
  return CellClass
}
</script>

<template>
  <div class="table w-100">
    <div
      class="row w-100 text-center bg-primary text-light p-3 rounded-3 fs-6 fw-semibold"
    >
      <div
        v-for="column in columns"
        :key="column.key"
        :class="`table__header-cell col ${column.className ?? ''}`"
        @click="column.click"
      >
        {{ column.label }}
        <i
          class="table__header-icon bi bi-arrow-down-up bg-primary text-light"
          v-if="column.click"
        ></i>
      </div>
      <div
        v-if="$slots.actions"
        class="table__header-cell col-1"
      >
        Действия
      </div>
    </div>

    <div
      class="row w-100 bg-light p-3 rounded-4 border border-2 text-center fs-6"
      v-for="(row, index) in searchedValue"
      :key="index"
    >
      <div
        v-for="column in columns"
        :key="column.key"
        :class="`${getCellStyle(column.getStyle, row[column.key])} ${
          column.className ?? ''
        }`"
      >
        {{ column.getFormat ? column.getFormat(row[column.key]) : row[column.key] }}
      </div>
      <div
        v-if="$slots.actions"
        class="table__row-cell col-1"
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
.table {
  @include flexible(center, center, column, $gap: 8px);

  &__header-cell {
    @include flexible(center, center);
  }

  &__header-icon {
    cursor: pointer;
  }

  &__row-cell {
    max-height: 100px;

    overflow: scroll;

    @include flexible(center, center);
  }
}
</style>