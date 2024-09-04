<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { TestProps } from '@Components/Modals/TestModal/TestModal.type'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import { TestResult } from '@Domain/Test'
import useTestStore from '@Store/tests/testsStore'
import useUserStore from '@Store/user/userStore'
import { useRouter, useRoute } from 'vue-router'

const isAvailable = ref(true)
const router = useRouter()
const route = useRoute()

const testStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<TestProps>()

const testResult = ref<TestResult>()

function goTest(testName: string) {
  router.push(`/tests/start-test/${testName}`)
}

function viewToResults(testName: string) {
  router.push(`/tests/${testName}/result/all`)
}

function accessClick() {
  const currentUser = user.value

  if (currentUser) {
    return (
      (currentUser.role === 'PROJECT_OFFICE' || currentUser.role === 'ADMIN') &&
      isAvailable.value
    )
  }
}

onMounted(async () => {
  const testName = route.params.testName
  if (testName) {
    try {
      const currentUser = user.value
      if (currentUser?.token) {
        const testName = route.params.testName.toString()
        const { token } = currentUser
        const response = await testStore.getTestResult(
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
      console.error('Ошибка при получении результатов', error)
      return
    }
  }
})
</script>
<template>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="w-100 bg-white rounded fs-5 text-primary">
      Название теста
    </Typography>
    <Typography> {{ test.name }} </Typography>
  </div>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="w-100 bg-white rounded fs-5 text-primary">
      Инструкция к тесту
    </Typography>
    <Typography> {{ test.description }} </Typography>
  </div>
  <div
    class="test-data__buttons p-3 w-100 bg-white rounded"
    v-if="accessClick() || !testResult"
  >
    <Button
      v-if="!testResult"
      variant="primary"
      @click="goTest(test.testName)"
    >
      Пройти тест
    </Button>
    <Button
      v-if="accessClick()"
      variant="primary"
      @click="viewToResults(test.testName)"
    >
      Результаты по тесту
    </Button>
  </div>
</template>
<style lang="scss" scoped>
.test-data {
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__buttons {
    @include flexible(stretch, flex-start, row, $gap: 16px);
  }
}
</style>
