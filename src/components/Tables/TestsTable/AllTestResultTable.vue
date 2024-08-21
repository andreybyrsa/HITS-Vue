<template>
  <Table
    class-name="p-3"
    :header="testsTableHeader"
    :columns="testsTableColumns"
    :data="results"
    :search-by="['user', 'result']"
  />
</template>

<script lang="ts" setup>
import { AllTestResultProps } from './AllTestResultTable.types'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'
import { TestResult } from '@Domain/Test'
import { User } from '@Domain/User'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<AllTestResultProps>()

const testsTableHeader: TableHeader = {
  label: 'Результаты теста',
  countData: true,
}

const testsTableColumns: TableColumn<TestResult>[] = [
  {
    key: 'user',
    label: 'Пользователь',
    // rowCellClick: navigateToTestModal,
    getRowCellStyle: getTestNameStyle,
  },
  {
    key: 'result',
    label: 'Результат',
  },
]

// function navigateToTestModal(test: Test) {
//   router.push(`/tests/list/${test.testName}`)
// }

function getTestNameStyle() {
  return 'text-primary'
}
</script>
