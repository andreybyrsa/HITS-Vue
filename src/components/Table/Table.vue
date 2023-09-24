<script lang="ts" setup>
import { computed } from 'vue'

import { TableProps } from '@Components/Table/Table.types'

const props = defineProps<TableProps>()

const searchedValue = computed(() => {
  return props.data.filter((element) => {
    const elementData = element.name.toLowerCase().trim()
    const currentSearchedValue = props.searchValue?.toLowerCase().trim()

    const isIncludesSearcheValue = elementData.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})

function getCellStyle(styleFunction?: (value: string) => string, value?: string) {
  let CellClass = 'table__row-cell col '
  if (styleFunction) {
    CellClass += styleFunction(value as string)
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
        v-if="$slots.icon"
        class="table__header-cell col-1"
      >
        Активные
      </div>
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
      class="row w-100 bg-light p-3 rounded-4 border text-center fs-6"
      v-for="(row, index) in searchedValue"
      :key="index"
    >
      <div
        v-if="$slots.icon"
        class="table__row-cell col-1"
      >
        <slot
          :item="row"
          name="icon"
        />
      </div>
      <div
        v-for="column in columns"
        :key="column.key"
        :class="`${getCellStyle(column.getStyle, row[column.key])} ${
          column.className ?? ''
        }`"
      >
        <template v-if="row[column.key]">
          {{
            column.getFormat ? column.getFormat(row[column.key]) : row[column.key]
          }}
        </template>
      </div>
      <div
        v-if="$slots.actions"
        class="table__row-cell col-1"
      >
        <slot
          :item="row"
          name="actions"
          class="table__action-cell"
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

    overflow: auto;

    @include flexible(center, center);
  }

  &__row-cell:last-child {
    max-height: 100px;

    overflow: hidden;

    @include flexible(center, center);
  }
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
