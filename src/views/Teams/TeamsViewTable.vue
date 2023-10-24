<script lang="ts" setup>
import { useDateFormat, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'

import TeamsViewTableProps from '@Views/Teams/TeamsViewTable.types'

import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Table from '@Components/Table/Table.vue'
import Icon from '@Components/Icon/Icon.vue'
import Team from '@Domain/Team'

const props = defineProps<TeamsViewTableProps>()

const router = useRouter()

const [isSorted, setIsSorted] = useToggle(true)

const columns: TableColumn[] = [
  { key: 'name', label: 'Название', click: () => sortName(props.command) },
  {
    key: 'createdAt',
    label: 'Дата создания',
    click: () => sortDate(props.command),
    getFormat: getFormattedDate,
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function sortDate(date: Team[]) {
  date.sort((a, b) => {
    const A = new Date(a.createdAt).getTime()
    const B = new Date(b.createdAt).getTime()
    return isSorted.value ? B - A : A - B
  })

  setIsSorted()
}

function sortName(changes: Team[]) {
  changes.sort((a, b) => {
    return isSorted.value
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  })

  setIsSorted()
}
</script>

<template>
  <Table
    :columns="columns"
    :data="props.command"
    :search-value="props.searchedValue"
  >
    <template #actions="{ item }: { item: Team }">
      <div class="bg-light">
        <Button
          class-name=" btn-primary text-white"
          prepend-icon-name="bi bi-list fs-4"
          v-dropdown="'lastActivityNoteTable'"
        ></Button>

        <DropDown id="lastActivityNoteTable">
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action p-1">
              <button
                class="w-100 text-start"
                @click="router.push(`${item.id}`)"
              >
                Просмотреть
              </button>
            </li>
            <li class="list-group-item list-group-item-action p-1">
              <button
                @click="router.push(`edit/${item.id}`)"
                class="w-100 text-start"
              >
                Редактировать
              </button>
            </li>
          </ul>
        </DropDown>
      </div>
    </template>
    <template #type="{ item }: { item: Team }">
      <Icon
        v-if="!item.closed"
        class-name="bi bi-unlock-fill text-success bg-transparent fs-5"
      />
      <Icon
        v-else
        class-name="bi bi-lock-fill text-danger bg-transparent fs-5"
      />
    </template>
  </Table>
</template>

<style lang="scss" scoped></style>
