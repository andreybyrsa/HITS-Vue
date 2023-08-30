<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { TableProps } from '@Components/Table/Table.types'

import useUserStore from '@Store/user/userStore'
import { Idea } from '@Domain/Idea'

const props = defineProps<TableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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

function checkMark(row: Idea) {
  const currentRole = user.value?.role
  const currentStatusIdea = row.status
  const currentInitiatorIdea = row.initiator
  const currentEmail = user.value?.email
  return currentRole == 'INITIATOR' &&
    (currentStatusIdea == 'NEW' || currentStatusIdea == 'ON_EDITING') &&
    currentInitiatorIdea == currentEmail
    ? true
    : currentRole == 'PROJECT_OFFICE' && currentStatusIdea == 'ON_APPROVAL'
    ? true
    : currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
    ? true
    : false
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
}
</style>
