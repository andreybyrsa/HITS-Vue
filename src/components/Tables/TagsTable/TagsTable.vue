<template>
  <Table
    class-name="p-3"
    :header="tagsTableHeader"
    :columns="tagTableColumns"
    :data="tags"
    :search-by="['name']"
    :filters="tagsFilters"
    :dropdown-actions-menu="dropdownSkillsActions"
  />

  <input
    type="color"
    class="form-control form-control-color"
    id="exampleColorInput"
    v-model="tagColor"
    title="Choose your color"
  />

  <div>{{ tagColor }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { Tag } from '@Domain/Tag'

const tags = defineModel<Tag[]>({ required: true })

const filterByIsConfirmed = ref<boolean>()

const tagColor = ref<string>()

const tagsFilters: Filter<Tag>[] = [
  {
    category: 'Статус',
    choices: [
      { label: 'Утверждена', value: true },
      { label: 'На рассмотрении', value: false },
    ],
    refValue: filterByIsConfirmed,
    isUniqueChoice: true,
    checkFilter: checkTagConfirmed,
  },
]

function checkTagConfirmed(tag: Tag, value: FilterValue) {
  return tag.confirmed === value
}

const tagsTableHeader: TableHeader = {
  label: 'Список тегов',
  countData: true,
  buttons: [
    {
      label: 'Добавить тег',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: console.log(1),
    },
  ],
}

const tagTableColumns: TableColumn<Tag>[] = [
  //   {
  //     key: 'color',
  //     label: '',
  //     getRowCellStyle: getCkeckedTagStyle,
  //     getRowCellFormat: () => '',
  //   },
  {
    key: 'name',
    label: 'Название',
  },
  {
    key: 'confirmed',
    label: 'Статус',
    getRowCellFormat: getTagStatusFormat,
    getRowCellStyle: getTagStatusStyle,
  },
]

const dropdownSkillsActions: DropdownMenuAction<Tag>[] = [
  {
    label: 'Редактировать',
    statement: (tag) => checkTagConfirmed(tag, true),
    click: console.log(1),
  },
  {
    label: 'Утвердить',
    statement: (tag) => checkTagConfirmed(tag, false),
    click: console.log(1),
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: console.log(1),
  },
]

function getTagStatusStyle(isConfirmed: boolean) {
  if (!isConfirmed) {
    return 'text-danger'
  }
}

function getTagStatusFormat(isConfirmed: boolean) {
  if (isConfirmed) {
    return 'Утверждено'
  }
  return 'На рассмотрении'
}

function getCkeckedTagStyle(color: string) {
  const initialClass = ['bi bi-circle-fill', 'fs-6', 'mt-1']

  return initialClass
}
</script>

<style scoped lang="scss"></style>
