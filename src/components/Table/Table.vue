<script lang="ts" setup generic="DataType">
import {
  ref,
  Ref,
  onMounted,
  computed,
  StyleValue,
  onBeforeMount,
  resolveComponent,
} from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  TableProps,
  TypedFormatFunction,
  TypedStyleFunction,
} from '@Components/Table/Table.types'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { FilterValue } from '@Components/FilterBar/FilterBar.types'
import Icon from '@Components/Icon/Icon.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Typography from '@Components/Typography/Typography.vue'
import TableCollapse from '@Components/Tables/LaunchQuestsTable/LaunchQuestTableCollapse.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import { compileStyle } from 'vue/compiler-sfc'

const props = defineProps<TableProps<DataType>>()

const data = ref<DataType[]>([]) as Ref<DataType[]>
const checkedData = defineModel<DataType[]>({
  default: [],
  required: false,
  local: true,
}) as Ref<DataType[]>
const searchedData = computed(() => searchDataByKeys())

const TableClassName = computed(() => ['w-100', 'bg-white', props.className ?? ''])

const tableLabel = computed(() => {
  const label = props.header?.label
  const countData = props.header?.countData

  if (countData) {
    return `${label}: ${searchedData.value.length}`
  }

  return label
})

const searchedValue = ref('')
const filtersRefs = ref<Ref<FilterValue | FilterValue[] | undefined>[]>([])

const isCheckedAll = ref(false)

onMounted(() => {
  if (props.filters) {
    filtersRefs.value = props.filters.map((filter) => filter.refValue)
  }
})

watchImmediate(
  () => props.data,
  () => {
    data.value = props.data
    checkedData.value = []

    searchDataByKeys()
    filterData(filtersRefs.value)
  },
  { deep: true },
)

watchImmediate(filtersRefs, (filters) => filterData(filters), { deep: true })
watchImmediate(searchedValue, () => searchDataByKeys())
watchImmediate(checkedData, () => {
  if (
    searchedData.value.length &&
    searchedData.value.length === checkedData.value.length
  ) {
    isCheckedAll.value = true
  } else {
    isCheckedAll.value = false
  }
})

function searchDataByKeys() {
  if (props.searchBy) {
    const searchKeys = props.searchBy

    return data.value.filter((value) => {
      const currentDataByKeys = searchKeys.map((key) =>
        `${value[key]}`.toLocaleLowerCase().trim(),
      )
      const currentSearchedValue = searchedValue.value
        .toLocaleLowerCase()
        .trim()
        .split(' ')

      return currentSearchedValue.every((searchWord) =>
        currentDataByKeys.some((dataByKey) => dataByKey.includes(searchWord)),
      )
    })
  }
  return data.value
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1)
  const set2 = new Set(array2)

  const intersectingArray: T[] = []

  for (const item of set1) {
    if (set2.has(item)) {
      intersectingArray.push(item)
    }
  }

  return intersectingArray
}

function filterData(filters: Ref<FilterValue | FilterValue[] | undefined>[]) {
  if (filters.length) {
    const isSelectedFilters = filters.some((filter) => {
      if (filter.value instanceof Array) {
        return filter.value.length
      }
      return filter.value !== undefined
    })

    if (isSelectedFilters) {
      data.value = props.data.filter((dataValue) => {
        return filters.every((filter, index) => {
          if (filter.value instanceof Array) {
            return filter.value.length
              ? filter.value.some((value) =>
                  props.filters?.[index].checkFilter(dataValue, value),
                )
              : true
          }

          return filter.value !== undefined
            ? props.filters?.[index].checkFilter(dataValue, filter.value)
            : true
        })
      })

      const filtredCheckData = intersection(checkedData.value, data.value)
      if (filtredCheckData) {
        checkedData.value = filtredCheckData
      }
    }
  } else {
    data.value = props.data
  }
}

function checkAllRows() {
  if (searchedData.value.length !== checkedData.value.length) {
    isCheckedAll.value = true
    checkedData.value = [...searchedData.value]
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

function rowCellStyleCSS(
  data: DataType[keyof DataType],
  functionClick?: (value: DataType[keyof DataType]) => StyleValue,
) {
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

function checkHeaderButtonStatement(statement?: boolean) {
  return statement !== undefined ? statement : true
}
function makeRandomId(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}
//ВНИМАНИЕ
//эти id устарняют колизии вложенных коллапсов НЕТРОГАТЬ
//ВНИМАНИЕ
const collapseIds = computed(() => {
  return searchedData.value.map(() => makeRandomId(10))
})
</script>

<template>
  <div :class="TableClassName">
    <div
      v-if="header"
      class="table__header w-100"
    >
      <Typography class-name="fs-2 text-primary">{{ tableLabel }}</Typography>

      <div
        v-if="header.buttons"
        class="d-flex gap-3"
      >
        <template
          v-for="(headerButton, index) in header.buttons"
          :key="index"
        >
          <Button
            v-if="checkHeaderButtonStatement(headerButton.statement)"
            :variant="headerButton.variant"
            :prepend-icon-name="headerButton.prependIconName"
            :append-icon-name="headerButton.appendIconName"
            @click="headerButton.click"
          >
            {{ headerButton.label }}
          </Button>
        </template>
      </div>
    </div>

    <div class="py-2 d-flex justify-content-between">
      <div
        v-if="searchBy"
        class="w-50"
      >
        <Input
          name="search"
          class-name="rounded-end"
          no-form-controlled
          v-model="searchedValue"
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
        <table class="table table-hover mb-0">
          <thead v-if="columns[0].label">
            <tr class="table__lables">
              <th
                v-if="collapseChildComponent"
                class="py-3 col-1"
              ></th>
              <th
                v-if="isCheckbox"
                class="py-3 col"
              >
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

              <th v-if="dropdownActionsMenu"></th>
              <th></th>
            </tr>
          </thead>
          <tbody
            v-for="(row, index) in searchedData"
            :key="index"
          >
            <tr>
              <td
                class="py-3 col-1"
                v-if="collapseChildComponent"
              >
                <Icon
                  class="table__row-icon bi bi-chevron-down"
                  type="button"
                  v-collapse="
                    `${props.collapseChildComponent?.__name}.${collapseIds[index]}`
                  "
                  @click="chevronAction"
                />
                <!-- @click="eventOfCollapse(index)" -->
              </td>
              <td
                v-if="isCheckbox"
                class="py-3 col"
              >
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
                class="py-3 col align-self-center"
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
                      <div
                        v-html="
                          getRowCellFormat(
                            row[column.key],
                            column.getRowCellFormat,
                            +index.toString(),
                          )
                        "
                      ></div>
                      <!-- {{
                        getRowCellFormat(
                          row[column.key],
                          column.getRowCellFormat,
                          +index.toString(),
                        )
                      }} -->
                    </div>
                  </template>
                  <div
                    v-else
                    :style="
                      rowCellStyleCSS(row[column.key], column.getRowCellStyleCSS)
                    "
                    :class="[
                      getRowCellStyle(row[column.key], column.getRowCellStyle),
                      column.rowCellClick ? 'table__link' : '',
                    ]"
                    @click="rowCellClick(row, column.rowCellClick)"
                  >
                    <div
                      v-html="
                        getRowCellFormat(row[column.key], column.getRowCellFormat)
                      "
                    ></div>
                    <!-- {{ getRowCellFormat(row[column.key], column.getRowCellFormat) }} -->
                  </div>
                </div>
              </td>

              <td
                class="py-3"
                v-if="dropdownActionsMenu?.length"
              >
                <div class="table__row-icon float-end">
                  <Icon
                    class-name=" bi bi-three-dots fs-5"
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
                          {{
                            checkDropdownActionStatement(
                              row,
                              button.statementLabel,
                            ) && button.statementLabel
                              ? button.beforeLabel
                              : button.label
                          }}
                        </li>
                      </template>
                    </ul>
                  </DropDown>
                </div>
              </td>
            </tr>

            <tr v-if="collapseChildComponent">
              <td
                class="col-12 p-0 border-0"
                colspan="100"
              >
                <Collapse
                  :className="`border-bottom`"
                  :id="`${props.collapseChildComponent?.__name}.${collapseIds[index]}`"
                >
                  <div class="py-2">
                    <component
                      :is="collapseChildComponent"
                      :data="row"
                    />
                  </div>
                </Collapse>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <FilterBar
        v-if="filters"
        class-name="ms-2 border-start"
        :filters="filters"
        :callback="callback"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__header {
    @include flexible(center, space-between, $gap: 16px);
  }

  &__lables {
    @include position(sticky, $top: 0, $z-index: 1);

    > th {
      box-shadow: inset 0 -1px 0 #dee2e6;
    }
  }

  &__header-icon {
    cursor: pointer;
  }

  &__row-icon {
    @include fixedWidth(24px);
    @include fixedHeight(24px);
    border-radius: 50%;
    width: 100%;

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

.no-hover {
  pointer-events: none;
}
</style>
