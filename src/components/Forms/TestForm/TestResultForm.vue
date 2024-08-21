<template>
  <div class="belbin-test-form w-100 h-100 bg-white p-3 overflow-auto">
    <div
      v-if="testResult"
      class="belbin-test-form__header w-75"
      id="my-target-section"
    >
      <Typography class-name="fs-2 text-primary"> Результаты теста </Typography>
      <Typography> {{ testResult.result }} </Typography>

      <Button
        variant="primary"
        @click="goBack()"
      >
        Вернуться к списку тестов
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { watchImmediate } from '@vueuse/core'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import useTestStore from '@Store/tests/testsStore'
import useUserStore from '@Store/user/userStore'
import { TestResult } from '@Domain/Test'

import TestService from '@Services/TestService'
import { User } from '@Domain/User'

const testsStore = useTestStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const testResult = ref<TestResult>()

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
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return
        }
        testResult.value = response
      }
    } catch (error) {
      console.error('Ошибка при получении теста', error)
      return
    }
  } else {
    router.push('/tests/list')
  }
})
watch(
  testResult,
  async () => {
    if (user.value?.token && testResult.value?.testName) {
      const { token } = user.value
      const { id: testName } = testResult.value
      await TestService.getTestResult(testName, user.value.id, token)
    }
  },
  { deep: true },
)
async function goBack() {
  router.push(`/tests/list`)
}
</script>
<style lang="scss" scoped>
.belbin-test-form {
  @include flexible(flex-start, center);

  &__header {
    @include flexible(center, flex-start, column, $gap: 16px);
  }

  &__content {
    @include flexible(flex-start, flex-start, row, $gap: 16px);
  }
}
.team-invite-form {
  width: 100%;
  @include flexible(start, start, column);

  &__main {
    width: 100%;
    @include flexible(start, start);
  }
}
</style>
