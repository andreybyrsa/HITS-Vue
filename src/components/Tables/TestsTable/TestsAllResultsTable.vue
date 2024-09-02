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

import { TestAllResponse, TestFilter } from '@Domain/Test'
import { User } from '@Domain/User'
import { getTestFilter } from '@Utils/testFilter'

import TestService from '@Services/TestService'
import useTestStore from '@Store/tests/testsStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { result } from 'lodash-es'

const props = defineProps<TestsAllResultsProps>()

const testStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { results } = storeToRefs(testStore)
const testResult = ref<TestAllResponse[]>()

const filterByStudyGroup = ref<string[]>([])
const filterByBelbinTest = ref<string[]>([])
const filterByExtraversion = ref<string[]>([])
const filterByNeuroticism = ref<string[]>([])
const filterByLie = ref<string[]>([])
const testFilterInfo = getTestFilter()
const filterByMindTest = ref<TestFilter[]>([])

const uniqueGroups = computed(() => {
  const groupsSet = new Set<string>()

  if (testResult.value) {
    testResult.value.forEach((test) => {
      groupsSet.add(test.user.studyGroup)
    })
  }
  return Array.from(groupsSet)
})

const BelbinTestResults = [
  'РЕАЛИЗАТОР',
  'КООРДИНАТОР',
  'МОТИВАТОР',
  'ГЕНЕРАТОР ИДЕЙ',
  'ИССЛЕДОВАТЕЛЬ',
  'АНАЛИТИК-ЭКСПЕРТ',
  'ВДОХНОВИТЕЛЬ',
  'КОНТРОЛЕР',
  'СПЕЦИАЛИСТ',
]

const ExtraversionResults = [
  'яркий экстраверт',
  'экстраверт',
  'среднее значение',
  'интроверт',
  'глубокий интроверт',
]

const NeuroticismResults = [
  'очень высокий уровень нейротизма',
  'высокий уровень нейротизма',
  'среднее значение',
  'низкий уровень нейротизма',
]

const LieResults = ['неискренность в ответах', 'норма']

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
  {
    category: 'Тест Белбина',
    choices: getBelbinResults(),
    refValue: filterByBelbinTest,
    isUniqueChoice: false,
    checkFilter: checkBelbinResult,
  },
  {
    category: 'Стиль мышления',
    choices: testFilterInfo.status.map((testFilter) => ({
      label: testFilterInfo.translatedStatus[testFilter],
      value: testFilter,
      click: () => getTestResultFilter(testFilter),
    })),
    refValue: filterByMindTest,
    isUniqueChoice: true,
    checkFilter: (test, filter) => checkTestFilter(test, filter as TestFilter),
  },
  {
    category: 'Экстраверсия',
    choices: getExtraversion(),
    refValue: filterByExtraversion,
    isUniqueChoice: false,
    checkFilter: checkExtraversionResult,
  },
  {
    category: 'Нейротизм',
    choices: getNeuroticism(),
    refValue: filterByNeuroticism,
    isUniqueChoice: false,
    checkFilter: checkNeuroticismResult,
  },
  {
    category: 'Ложь',
    choices: getLie(),
    refValue: filterByLie,
    isUniqueChoice: false,
    checkFilter: checkTemperResult,
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

function getBelbinResults() {
  return BelbinTestResults
    ? BelbinTestResults.map((result) => ({
        label: result,
        value: result,
      }))
    : []
}

function getExtraversion() {
  return ExtraversionResults
    ? ExtraversionResults.map((result) => ({
        label: result,
        value: result,
      }))
    : []
}

function getNeuroticism() {
  return NeuroticismResults
    ? NeuroticismResults.map((result) => ({
        label: result,
        value: result,
      }))
    : []
}

function getLie() {
  return LieResults
    ? LieResults.map((result) => ({
        label: result,
        value: result,
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
  return test.user.studyGroup === group
}

function checkBelbinResult(test: TestAllResponse, result: FilterValue) {
  return test.belbinResult === result
}

function checkTemperResult(test: TestAllResponse, result: FilterValue) {
  return test.temperResult.includes(result.toString())
}

function checkExtraversionResult(test: TestAllResponse, result: FilterValue) {
  return test.temperResult.includes(result.toString() + '\nУровень Нейротизма')
}

function checkNeuroticismResult(test: TestAllResponse, result: FilterValue) {
  return test.temperResult.includes(result.toString() + '\nУровень Лжи')
}

async function getTestResultFilter(filter: TestFilter) {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await testStore.getTestGeneral(filter, token)
    if (response instanceof Error) {
      return
    }
    testResult.value = response
  }
}

async function checkTestFilter(test: TestAllResponse, filter: TestFilter) {
  if (filter === 'ALL') return
  else
    return test.mindResult.includes(
      testFilterInfo.translatedStatus[filter].toString(),
    )
}

async function getAllResponse() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await testStore.getTestGeneral('ALL', token)
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
    const response = await TestService.getTestGeneral('ALL', token)
    if (response instanceof Error) {
      return
    }
    testResult.value = response
  }
})
</script>
<style lang="scss" scoped></style>
