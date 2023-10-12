<script lang="ts" setup>
import { ref } from 'vue'
import { useDateFormat, useToggle } from '@vueuse/core'

import Command from '@Domain/Command'
import CommandViewTableProps from '@Views/CommandView/CommandViewTable.types'

import { TableColumn } from '@Components/Table/Table.types'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Table from '@Components/Table/Table.vue'
import Icon from '@Components/Icon/Icon.vue'

const props = defineProps<CommandViewTableProps>()

const [isSorted, setIsSorted] = useToggle(true)

const columns: TableColumn[] = [
  { key: 'name', label: 'Название', click: () => sortName(props.command) },
  {
    key: 'dateCreation',
    label: 'Дата создания',
    click: () => sortDate(props.command),
    getFormat: getFormattedDate,
  },
  //   {
  //     key: 'competencies',
  //     label: 'Компетенции',
  //     getFormat: getFormattedCompetencies,
  //   },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getFormattedCompetencies(competencies: string[]) {
  if (competencies) {
    const formattedCompetencies = competencies
      .map((item: string) => ` ${item}`)
      .join()
    return formattedCompetencies
  }
}

//  Можно сделать еще один слот, как с действием или активными

function sortDate(date: Command[]) {
  date.sort((a, b) => {
    const A = new Date(a.dateCreation).getTime()
    const B = new Date(b.dateCreation).getTime()
    return isSorted.value ? A - B : B - A
  })

  setIsSorted()
}

function sortName(changes: Command[]) {
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
              <button class="w-100 text-start">Просмотреть</button>
            </li>
            <li class="list-group-item list-group-item-action p-1">
              <button class="w-100 text-start">Редактировать</button>
            </li>
            <li class="list-group-item list-group-item-action p-1">
              <button class="w-100 text-start text-danger">Удалить</button>
            </li>
            <li class="list-group-item list-group-item-action p-1">
              <button class="w-100 text-start text-success">Вступить</button>
            </li>
          </ul>
        </DropDown>
      </div>
    </template>
    <template #icon="{ item }: { item: Command }">
      <Icon
        v-if="item.typeGroup == 'OPEN_TEAM'"
        class-name="bi bi-circle-fill text-success bg-transparent fs-6"
      />
      <Icon
        v-else
        class-name="bi bi-circle-fill text-danger bg-transparent fs-6"
      />
    </template>
    <template #competencies="{ item }: { item: Command }">
      <div class="bg-light">
        <Button
          type="button"
          class-name=" btn-primary"
          v-dropdown="'CommandViewTable'"
          >Просмотреть
        </Button>
        <DropDown id="CommandViewTable">
          <ul
            v-for="competencies in item.competencies"
            :key="competencies"
            class="list-group list-group-flush"
          >
            <li class="list-group-item p-1">
              {{ competencies }}
            </li>
          </ul>
        </DropDown>
      </div>
    </template>
  </Table>
</template>

<style lang="scss" scoped></style>
