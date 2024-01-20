<template>
  <Table
    class-name="p-3"
    :columns="usersTableColumns"
    :data="projects"
    :search-by="['teamName']"
    :dropdown-actions-menu="dropdownUsersActions"
  />
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'

import { TeamProjectsProps } from '@Components/Tables/ProfileExperienceTable/ProfileExperience.types'

import { ProjectMember } from '@Domain/Project'

defineProps<TeamProjectsProps>()

const usersTableColumns: TableColumn<ProjectMember>[] = [
  {
    key: 'projectName',
    label: 'Название',
    size: 'col-4',
    rowCellClick: () => null,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    getRowCellFormat: getFormattedDate,
    contentClassName: 'justify-content-center align-items-center text-center',
  },
  {
    key: 'finishDate',
    label: 'Дата выхода',
    getRowCellFormat: getFormattedDate,
    getRowCellStyle: getFinishDateStyle,
    contentClassName: 'justify-content-center align-items-center text-center',
  },
]

const dropdownUsersActions: DropdownMenuAction<ProjectMember>[] = [
  {
    label: 'Перейти в проект',
    click: () => null,
  },
]

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else return 'В проекте'
}

function getFinishDateStyle(finishDate: string) {
  const initialStyle = ['']
  if (!finishDate) {
    initialStyle.push('text-primary')
    return initialStyle
  }
}
</script>
