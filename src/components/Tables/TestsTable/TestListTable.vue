<template>
  <Table
    class-name="p-3"
    :header="testsTableHeader"
    :columns="testsTableColumns"
    :data="tests"
    :search-by="['name']"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { TestListTableProps } from './TestListTable.types'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { Test } from '@Domain/Test'
import { useRouter } from 'vue-router'

import useUserStore from '@Store/user/userStore'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

defineProps<TestListTableProps>()

const testsTableHeader: TableHeader = {
  label: 'Список тестов',
  countData: true,
  buttons: [
    {
      label: 'Результаты пользователей',
      variant: 'primary',
      click: goTestAllResults,
      statement:
        user.value?.role === 'ADMIN' || user.value?.role === 'PROJECT_OFFICE',
    },
  ],
}

const testsTableColumns: TableColumn<Test>[] = [
  {
    key: 'name',
    label: 'Название',
    rowCellClick: navigateToTestModal,
    getRowCellStyle: getTestNameStyle,
  },
]

function goTestAllResults() {
  router.push(`/tests/general`)
}

function navigateToTestModal(test: Test) {
  router.push(`/tests/list/${test.testName}`)
}

function getTestNameStyle() {
  return 'text-primary'
}
</script>
