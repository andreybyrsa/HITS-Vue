<script lang="ts" setup generic="DataType">
import { ref, computed, Ref } from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  TableProps,
  TypedFormatFunction,
  TypedStyleFunction,
} from '@Components/Table/Table.types'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import Icon from '@Components/Icon/Icon.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'

const props = defineProps<TableProps<DataType>>()

const data = ref<DataType[]>([]) as Ref<DataType[]>
const checkedData = ref<DataType[]>([]) as Ref<DataType[]>
const searchValue = ref('')
const isCheckedAll = ref(false)

watchImmediate(
  () => props.data,
  () => {
    data.value = props.data
  },
)

watchImmediate(checkedData, () => {
  if (data.value.length === checkedData.value.length) {
    isCheckedAll.value = true
  } else {
    isCheckedAll.value = false
  }
})

const searchedData = computed(() => {
  if (props.searchBy) {
    const currentDataKey = props.searchBy

    return data.value.filter((value) => {
      const currentData = `${value[currentDataKey]}`.toLocaleLowerCase().trim()
      const isIncludesSearcheValue = currentData.includes(searchValue.value)

      return isIncludesSearcheValue
    })
  }
  return data.value
})

function checkAllRows() {
  if (data.value.length !== checkedData.value.length) {
    isCheckedAll.value = true
    checkedData.value = data.value
  } else {
    isCheckedAll.value = false
    checkedData.value = []
  }
}

function getColumnStyle(columnClassName?: string) {
  const columnClass = ['py-3', 'col', 'fw-semibold', 'text-secondary']
  if (columnClassName) columnClass.push(columnClassName)
  return columnClass
}

function getRowCellStyle(
  data: DataType[keyof DataType],
  styleFunction?: TypedStyleFunction<DataType>,
  ...args: number[]
) {
  if (styleFunction) {
    return styleFunction(data, ...args)
  }
}

function getRowCellFormat(
  data: DataType[keyof DataType],
  formatFunction?: TypedFormatFunction<DataType>,
  ...args: number[]
) {
  if (formatFunction) {
    return formatFunction(data, ...args)
  }
  return data
}

function rowCellClick(data: DataType, functionClick?: (value: DataType) => void) {
  if (functionClick) {
    return functionClick(data)
  }
}

function getDropdownActionStyle(className?: string) {
  const actionButtonClass = [
    'list-group-item',
    'list-group-item-action',
    'px-2',
    'py-1',
  ]
  if (className) {
    actionButtonClass.push(className)
  }
  return actionButtonClass
}

function getCheckedDataActionStatement(statement?: boolean) {
  if (statement !== undefined) {
    return statement
  }
  return true
}

function checkDropdownActionStatement(
  data: DataType,
  statement?: (value: DataType) => boolean,
) {
  if (statement) {
    return statement(data)
  }
  return true
}
</script>

<template>
  <div class="w-100">
    <div class="bg-white p-2 d-flex justify-content-between">
      <div
        v-if="searchBy"
        class="w-50"
      >
        <Input
          name="search"
          class-name="rounded-end"
          no-form-controlled
          v-model="searchValue"
          placeholder="Поиск"
        >
          <template #prepend>
            <Icon class-name="bi bi-search" />
          </template>
        </Input>
      </div>

      <Transition name="checked-data-actions">
        <div
          v-if="checkedData.length"
          class="d-flex gap-2"
        >
          <template
            v-for="(button, index) in checkedDataActions"
            :key="index"
          >
            <Button
              v-if="getCheckedDataActionStatement(button.statement)"
              :class-name="button.className"
              @click="button.click(checkedData)"
            >
              {{ button.label }}
            </Button>
          </template>
        </div>
      </Transition>
    </div>

    <div class="w-100 d-flex">
      <div class="w-100">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="py-3 col">
                <div @click="checkAllRows">
                  <Checkbox
                    name="checkAll"
                    class-name="mb-1"
                    no-form-controlled
                    v-model="isCheckedAll"
                  />
                </div>
              </th>

              <th
                v-for="column in columns"
                :key="column.key"
                :class="getColumnStyle(column.size)"
              >
                <div :class="`${column.contentClassName ?? ''} d-flex`">
                  {{ column.label }}
                  <Icon
                    v-if="column.headerCellClick"
                    class-name="table__row-icon ms-1 bi bi-chevron-down text-secondary"
                    @click="column.headerCellClick"
                  />
                </div>
              </th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in searchedData"
              :key="index"
            >
              <td class="py-3 col">
                <Checkbox
                  :name="`checkAll-${index}`"
                  class-name="mb-1"
                  no-form-controlled
                  v-model="checkedData"
                  :value="row"
                />
              </td>

              <td
                v-for="column in columns"
                :key="column.key"
                class="py-3 col"
              >
                <div
                  :class="`${column.contentClassName ?? ''} flex-wrap d-flex gap-1`"
                >
                  <template v-if="row[column.key] instanceof Array">
                    <div
                      v-for="(value, index) in row[column.key]"
                      :key="index"
                      :class="
                        getRowCellStyle(
                          row[column.key],
                          column.getRowCellStyle,
                          +index.toString(),
                        )
                      "
                    >
                      {{
                        getRowCellFormat(
                          row[column.key],
                          column.getRowCellFormat,
                          +index.toString(),
                        )
                      }}
                    </div>
                  </template>

                  <div
                    v-else
                    :class="[
                      getRowCellStyle(row[column.key], column.getRowCellStyle),
                      column.rowCellClick ? 'table__link' : '',
                    ]"
                    @click="rowCellClick(row, column.rowCellClick)"
                  >
                    {{ getRowCellFormat(row[column.key], column.getRowCellFormat) }}
                  </div>
                </div>
              </td>

              <td class="py-3">
                <div class="table__row-icon">
                  <Icon
                    class-name="bi bi-three-dots fs-5"
                    v-dropdown="`dropdown-menu-${index}`"
                  />

                  <DropDown :id="`dropdown-menu-${index}`">
                    <ul class="list-group list-group-flush">
                      <template
                        v-for="(button, index) in dropdownActionsMenu"
                        :key="index"
                      >
                        <li
                          v-if="checkDropdownActionStatement(row, button.statement)"
                          :class="getDropdownActionStyle(button.className)"
                          @click="button.click(row)"
                        >
                          {{ button.label }}
                        </li>
                      </template>
                    </ul>
                  </DropDown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <FilterBar
        v-if="filters"
        class-name="ms-2 border-start"
        :filters="filters"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__header-icon {
    cursor: pointer;
  }

  &__row-icon {
    @include fixedWidth(24px);
    @include fixedHeight(24px);
    border-radius: 50%;

    cursor: pointer;

    @include flexible(center, center);

    transition: all 0.2s ease-out;

    &:active {
      background-color: #00000026;
    }
  }

  &__link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }
}

.checked-data-actions {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
