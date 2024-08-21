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

defineProps<AllTestResultProps>()

const testsTableHeader: TableHeader = {
  label: 'Результаты теста',
  countData: true,
}

const testsTableColumns: TableColumn<TestResult>[] = [
  {
    key: 'user',
    label: 'Почта',
    getRowCellFormat: getFormatUserEmail,
  },
  {
    key: 'user',
    label: 'Имя',
    getRowCellFormat: getFormatUserName,
  },
  {
    key: 'user',
    label: 'Фамилия',
    getRowCellFormat: getFormatUserLastName,
  },
  {
    key: 'result',
    label: 'Результат',
    // getRowCellFormat: getFormatResult,
  },
]

function getFormatUserLastName(user: User) {
  return user.lastName
}

function getFormatUserEmail(user: User) {
  return user.email
}

function getFormatUserName(user: User) {
  return user.firstName
}

// function getFormatResult(result: string) {
//   return result.replace(/\n/g, '<br>')
// }
</script>
<style lang="scss" scoped></style>
