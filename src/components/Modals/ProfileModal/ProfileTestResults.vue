<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { TestResult } from '@Domain/Test'

import useUserStore from '@Store/user/userStore'
import useTestStore from '@Store/tests/testsStore'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'
import Typography from '@Components/Typography/Typography.vue'

const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const testStore = useTestStore()

const belbinTestResults = ref<TestResult>()
const temperTestResult = ref<TestResult>()
const mindTestResult = ref<TestResult>()

const formattedBelbinResult = computed(() => {
  return belbinTestResults.value?.testResult.replace(/\n/g, '<br>')
})

const formattedTemperResult = computed(() => {
  return temperTestResult.value?.testResult.replace(/\n/g, '<br>')
})

const formattedMindResult = computed(() => {
  return mindTestResult.value?.testResult.replace(/\n/g, '<br>')
})
onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const userId = route.params.id.toString()

    const profileParallelRequests: RequestConfig[] = [
      {
        request: () => testStore.getTestResult('BelbinTest', userId, token),
        refValue: belbinTestResults,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => testStore.getTestResult('TemperTest', userId, token),
        refValue: temperTestResult,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => testStore.getTestResult('MindTest', userId, token),
        refValue: mindTestResult,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(profileParallelRequests)
  }
})
</script>

<template>
  <div class="profile-test w-100 bg-white border p-3 rounded-3">
    <div class="profile-test__header border-bottom">
      <Typography class-name="fs-5 text-primary">Результаты тестирований</Typography>
    </div>

    <div class="profile-test__content mt-3">
      <Typography class-name="text-decoration-underline">Тест Белбина:</Typography>
      <p
        v-if="belbinTestResults?.testResult"
        v-html="formattedBelbinResult"
      ></p>
      <Typography
        v-else
        class-name="fs-6 text-secondary"
        >Вы не прошли тест</Typography
      >
    </div>

    <div class="profile-test__content mt-3">
      <Typography class-name="text-decoration-underline"
        >Айзенка личностный опросник:</Typography
      >
      <p
        v-if="temperTestResult?.testResult"
        v-html="formattedTemperResult"
      ></p>
      <Typography
        v-else
        class-name="fs-6 text-secondary"
        >Вы не прошли тест</Typography
      >
    </div>

    <div class="profile-test__content mt-3">
      <Typography class-name="text-decoration-underline"
        >Опросник «Стиль мышления»:</Typography
      >
      <p
        v-if="mindTestResult?.testResult"
        v-html="formattedMindResult"
      ></p>
      <Typography
        v-else
        class-name="fs-6 text-secondary"
        >Вы не прошли тест</Typography
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-test {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
</style>
