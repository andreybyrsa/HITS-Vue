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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'

import { Test } from '@Domain/Test'

const router = useRouter()

const tests = defineModel<Test[]>({ required: true })

const testsTableHeader: TableHeader = {
  label: 'Список тестов',
  countData: true,
}

const testsTableColumns: TableColumn<Test>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-5',
    rowCellClick: navigateToTestModal,
    getRowCellStyle: getTestNameStyle,
  },
]

function navigateToTestModal(test: Test) {
  router.push(`/tests/list/${test.testName}`)
}

function getTestNameStyle() {
  return 'text-primary'
}
</script>
