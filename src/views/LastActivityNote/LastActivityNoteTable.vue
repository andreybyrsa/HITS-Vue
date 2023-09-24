<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat, useToggle } from '@vueuse/core'

import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Table from '@Components/Table/Table.vue'

import {
  LastActivityNoteProps,
  Change,
} from '@Views/LastActivityNote/LastActivityNote.types'

const props = defineProps<LastActivityNoteProps>()

const [isSorted, setIsSorted] = useToggle(true)

const columns: TableColumn[] = [
  {
    key: 'date',
    label: 'Дата',
    click: () => sortDate(props.changes),
    getFormat: getFormattedDate,
  },
  { key: 'who', label: 'Кто', click: () => sortWho(props.changes) },
  { key: 'doing', label: 'Что сделал', click: () => sortDoing(props.changes) },
  { key: 'name', label: 'Номер идеи', click: () => sortName(props.changes) },
]

const searchValue = ref('')

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
    :search-value="searchValue"
  >
    <template #actions>
      <div class="bg-light">
        <Button
          class-name=" btn-primary text-white"
          prepend-icon-name="bi bi-list fs-4"
          v-dropdown="'lastActivityNoteTable'"
        ></Button>

        <DropDown id="lastActivityNoteTable">
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action p-1">
              <button class="w-100 text-start">Перейти к идее</button>
            </li>
          </ul>
        </DropDown>
      </div>
    </template>
  </Table>
</template>

<style lang="scss" scoped></style>
