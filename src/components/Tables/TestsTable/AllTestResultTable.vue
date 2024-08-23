<template>
  <Table
    class-name="p-3"
    :header="testsTableHeader"
    :columns="testsTableColumns"
    :data="results"
    :search-by="['user', 'testResult']"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { AllTestResultProps, TestsAllResultsProps } from './TestListTable.types'
import { TableColumn, TableHeader } from '@Components/Table/Table.types'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import Table from '@Components/Table/Table.vue'
import Button from '@Components/Button/Button.vue'
import { TestResult, TestAllResponse } from '@Domain/Test'
import { User } from '@Domain/User'
import TestService from '@Services/TestService'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

import { useRoute, useRouter } from 'vue-router'
import useNotificationsStore from '@Store/notifications/notificationsStore'
const route = useRoute()
const router = useRouter()

const props = defineProps<AllTestResultProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const testResult = ref<TestResult>()
const testTitle = computed(() => {
  if (!testResult.value) return '' // Если testResult пока нет, возвращаем пустую строку
  switch (testResult.value.testName) {
    case 'BelbinTest':
      return 'теста Белбина'
    case 'TemperTest':
      return 'личностного опросника Айзенка'
    case 'MindTest':
      return 'опросника на стиль мышления'
    default:
      return 'неизвестного теста' // Значение по умолчанию
  }
})

const testsTableHeader = computed<TableHeader>(() => ({
  label: `Результаты ${testTitle.value}`,
  countData: true,
  buttons: [
    {
      label: 'Скачать результаты',
      variant: 'primary',
      prependIconName: 'bi bi-filetype-txt',
      click: () => downloadTestResults(testResult.value!.testName),
    },
  ],
}))

const testsTableColumns: TableColumn<TestResult>[] = [
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
    key: 'testResult',
    label: 'Результат',
    getRowCellFormat: getFormatResult,
  },
]

const downloadTestResults = async (testName: string) => {
  const token = user.value?.token
  if (!token) return
  await TestService.downloadResults(testName, token)
}

function getFormatUserLastName(user: User) {
  return user.lastName
}

function getFormatUserName(user: User) {
  return user.firstName
}

function getFormatUserGroup(user: User) {
  return user.studyGroup
}

function getFormatResult(result: string) {
  return result.replace(/\n/g, '<br>')
}

onMounted(async () => {
  const testName = route.params.testName
  if (testName) {
    try {
      const currentUser = user.value
      if (currentUser?.token) {
        const testName = route.params.testName.toString()
        const { token } = currentUser
        const response = await TestService.getTestResult(
          testName,
          currentUser.id,
          token,
        )
        if (response instanceof Error) {
          return
        }
        testResult.value = response
      }
    } catch (error) {
      console.error('Ошибка результатов', error)
      return
    }
  }
})
</script>
<style lang="scss" scoped></style>
