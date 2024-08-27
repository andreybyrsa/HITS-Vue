<template>
  <Table
    class-name="p-3"
    :header="testsTableHeader"
    :columns="testsTableColumns"
    :data="results"
    :search-by="['user']"
    :filters="testFilters"
    :callback="getAllResponse"
  />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { TestsAllResultsProps } from './TestListTable.types'

import Table from '@Components/Table/Table.vue'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'

import { TestAllResponse } from '@Domain/Test'
import { User } from '@Domain/User'
import TestService from '@Services/TestService'
import useTestStore from '@Store/tests/testsStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<TestsAllResultsProps>()

const testStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { results } = storeToRefs(testStore)
const testResult = ref<TestAllResponse[]>()

const filterByStudyGroup = ref<string[]>([])

const uniqueGroups = computed(() => {
  const groupsSet = new Set<string>()

  if (testResult.value) {
    testResult.value.forEach((test) => {
      groupsSet.add(test.user.studyGroup)
    })
  }
  return Array.from(groupsSet)
})

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
    key: 'belbinResult',
    label: 'Тест Белбина',
    getRowCellFormat: getFormatResult,
    size: 'col-2',
  },
  {
    key: 'mindResult',
    label: 'Стиль мышления',
    getRowCellFormat: getFormatResult,
    size: 'col-2',
  },
  {
    key: 'temperResult',
    label: 'Личностный опросник Айзенка',
    getRowCellFormat: getFormatResult,
    size: 'col-3',
  },
]

const testFilters = computed<Filter<TestAllResponse>[]>(() => [
  {
    category: 'Учебная группа',
    choices: getGroups(),
    refValue: filterByStudyGroup,
    isUniqueChoice: false,
    checkFilter: checkStudyGroup,
  },
])

function getGroups() {
  return uniqueGroups.value
    ? uniqueGroups.value.map((group) => ({
        label: group,
        value: group,
      }))
    : []
}

function getFormatUserLastName(user: User) {
  return user.lastName
}

function getFormatUserGroup(user: User) {
  return user.studyGroup
}

function getFormatUserName(user: User) {
  return user.firstName
}

function getFormatResult(test: string) {
  return test.replace(/\n/g, '<br>')
}

function checkStudyGroup(test: TestAllResponse, group: FilterValue) {
  console.log(group)
  return test.user.studyGroup === group
}

async function getAllResponse() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await testStore.getTestGeneral(token)
    if (response instanceof Error) {
      return
    }
    testResult.value = response
  }
}

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TestService.getTestGeneral(token)
    if (response instanceof Error) {
      return
    }
    testResult.value = response
  }
})
</script>
<style lang="scss" scoped></style>
