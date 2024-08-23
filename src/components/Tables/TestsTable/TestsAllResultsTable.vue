<template>
  <Table
    class-name="p-3"
    :header="testsTableHeader"
    :columns="testsTableColumns"
    :data="results"
    :search-by="['user']"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { TestsAllResultsProps } from './TestListTable.types'

import Table from '@Components/Table/Table.vue'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'
import { Filter } from '@Components/FilterBar/FilterBar.types'

import { TestAllResponse, TestResult } from '@Domain/Test'
import { User } from '@Domain/User'
import TestService from '@Services/TestService'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const route = useRoute()

const props = defineProps<TestsAllResultsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const testResult = ref<TestAllResponse>()

const testsTableHeader: TableHeader = {
  label: `Все результаты`,
  countData: true,
}

const testsTableColumns: TableColumn<TestAllResponse>[] = [
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
    key: 'user',
    label: 'Группа',
    getRowCellFormat: getFormatUserGroup,
  },
  {
    key: 'belbinTest',
    label: 'Тест Белбина',
    getRowCellFormat: getFormatResult,
  },
  {
    key: 'mindTest',
    label: 'Стиль мышления',
    getRowCellFormat: getFormatResult,
    size: 'col-2',
  },
  {
    key: 'temperTest',
    label: 'Личностный опросник Айзенка',
    getRowCellFormat: getFormatResult,
  },
]

function getFormatUserLastName(user: User) {
  return user.lastName
}

function getFormatUserGroup(user: User) {
  return user.studyGroup
}

function getFormatUserName(user: User) {
  return user.firstName
}

function getFormatResult(belbinTest: TestResult) {
  return belbinTest.result.replace(/\n/g, '<br>')
}
// replace(/\n/g, '<br>')
</script>
<style lang="scss" scoped></style>
