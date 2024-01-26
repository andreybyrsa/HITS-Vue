<template>
  <Table
    class-name="p-3"
    :columns="projectListTableColumns"
    :data="projects"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownProjectListActions"
    :header="projectListTableHeader"
    :filters="projectListFilters"
  />
</template>

<script lang="ts" setup>
import ProjectListTableProps from '@Components/Tables/ProjectListTable/ProjectListTable.types'

import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { getProjectStatus, getProjectStatusStyle } from '@Utils/getProjectStatus'

import { Project, ProjectStatus } from '@Domain/Project'
import { useDateFormat } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import { useRouter } from 'vue-router'

defineProps<ProjectListTableProps>()

const filterByProjectList = ref<ProjectStatus>()

const router = useRouter()

const projectListTableHeader: TableHeader = {
  label: 'Список проектов',
  countData: true,
}

const projectListTableColumns: TableColumn<Project>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: navigateToUpdateIdeaForm,
  },
  {
    key: 'status',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getProjectStatusStyle,
    getRowCellFormat: getProjectStatusFormat,
  },
  {
    key: 'startDate',
    label: 'Дата старта',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'finishDate',
    label: 'Дата окончания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    getRowCellStyle: getFinishDate,
  },
]

const dropdownProjectListActions: DropdownMenuAction<Project>[] = [
  {
    label: 'Перейти в проект',
    click: navigateToUpdateIdeaForm,
  },
]

const projectListFilters: Filter<Project>[] = [
  {
    category: 'Статусы',
    choices: getProjectStatus().status.map((status) => ({
      label: getProjectStatus().translatedStatus[status],
      value: status,
    })),
    refValue: filterByProjectList,
    isUniqueChoice: true,
    checkFilter: checkProjectListStatus,
    statement: computed(() => true),
  },
]

function navigateToUpdateIdeaForm(project: Project) {
  router.push(`/projects/${project.id}`)
}

function checkProjectListStatus(project: Project, status: FilterValue) {
  return project.status === status
}

function getProjectStatusFormat(status: ProjectStatus) {
  return getProjectStatus().translatedStatus[status]
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

function getFinishDate(date: string) {
  const initialClass: string[] = []

  if (date) {
    return initialClass
  }

  initialClass.push('text-primary')
  return initialClass
}
</script>
