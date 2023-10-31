<script lang="ts" setup>
import { useDateFormat, useToggle } from '@vueuse/core'

import { TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'

import {
  LastActivityNoteProps,
  Change,
} from '@Views/LastActivityNote/LastActivityNote.types'

const props = defineProps<LastActivityNoteProps>()

const [isSorted, setIsSorted] = useToggle(true)

const columns: TableColumn<Change>[] = [
  {
    key: 'date',
    label: 'Дата',
    headerCellClick: () => sortDate(props.changes),
    getRowCellFormat: getFormattedDate,
  },
  { key: 'who', label: 'Кто', headerCellClick: () => sortWho(props.changes) },
  {
    key: 'doing',
    label: 'Что сделал',
    headerCellClick: () => sortDoing(props.changes),
  },
  {
    key: 'name',
    label: 'Номер идеи',
    headerCellClick: () => sortName(props.changes),
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function sortDate(changes: Change[]) {
  changes.sort((a, b) => {
    const A = new Date(a.date).getTime()
    const B = new Date(b.date).getTime()
    return isSorted.value ? A - B : B - A
  })

  setIsSorted()
}
function sortWho(changes: Change[]) {
  changes.sort((a, b) => {
    return isSorted.value ? a.who.localeCompare(b.who) : b.who.localeCompare(a.who)
  })

  setIsSorted()
}
function sortDoing(changes: Change[]) {
  changes.sort((a, b) => {
    return isSorted.value
      ? a.doing.localeCompare(b.doing)
      : b.doing.localeCompare(a.doing)
  })

  setIsSorted()
}
function sortName(changes: Change[]) {
  changes.sort((a, b) => {
    return isSorted.value
      ? parseInt(a.name) - parseInt(b.name)
      : parseInt(b.name) - parseInt(a.name)
  })

  setIsSorted()
}
</script>

<template>
  <Table
    :columns="columns"
    :data="props.changes"
    search-by="name"
  ></Table>
</template>
