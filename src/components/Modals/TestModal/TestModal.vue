<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import TestHeader from '@Components/Modals/TestModal/TestHeader.vue'
import TestDescription from '@Components/Modals/TestModal/TestDescription.vue'
import TestResultModal from '@Components/Modals/TestModal/TestResultModal.vue'

import useUserStore from '@Store/user/userStore'
import useTestStore from '@Store/tests/testsStore'
import { Test, TestResult } from '@Domain/Test'

import TestService from '@Services/TestService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { tokenToString } from 'typescript'
import TestPlaceholderModal from './TestPlaceholderModal.vue'

const userStore = useUserStore()
const testsStore = useTestStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
const notificationsStore = useNotificationsStore()

const isLoading = ref(false)
const isOpened = ref<boolean>(true)
const isPassed = ref<boolean>(false)
const test = ref<Test>()
const testResult = ref<TestResult>()

// onMounted(async () => {
//   const testName = route.params.testName
//   if (testName) {
//     try {
//       const currentUser = user.value
//       if (currentUser?.token) {
//         const testName = route.params.testName.toString()
//         const { token } = currentUser
//         const response = await TestService.getTest(testName, token)
//         if (response instanceof Error) {
//           useNotificationsStore().createSystemNotification(
//             'Система',
//             response.message,
//           )
//           return
//         }
//         test.value = response
//       }
//     } catch (error) {
//       console.error('Ошибка при получении теста', error)
//       return
//     }
//   } else {
//     router.push('/tests/list')
//   }
// })
// watch(
//   test,
//   async () => {
//     if (user.value?.token && test.value?.testName) {
//       const { token } = user.value
//       const { id: testName } = test.value
//       await TestService.getTest(testName, token)
//     }
//   },
//   { deep: true },
// )

watchImmediate(
  () => route.params.testName,
  async () => {
    await getTestModal()
  },
)

async function getTestModal() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    if (route.params.testName) {
      const testName = route.params.testName.toString()

      isLoading.value = true

      const testParallelRequests: RequestConfig[] = [
        {
          request: () => TestService.getTest(testName, token),
          refValue: test,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => TestService.getTestResult(testName, token),
          refValue: testResult,
        },
      ]

      await sendParallelRequests(testParallelRequests)

      isLoading.value = false
    }
  }
}

function closeModal() {
  isOpened.value = false
  router.push({ name: 'tests' })
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    appear-on-render
    @on-outside-close="closeModal"
  >
    <div
      v-if="test"
      class="test-modal p-3"
    >
      <div class="test-modal__main">
        <TestHeader @close-modal="closeModal" />
        <div
          v-if="testResult"
          class="test-modal__main"
        >
          <TestResultModal :test-result="testResult" />
        </div>
        <TestDescription :test="test" />
      </div>
    </div>
    <TestPlaceholderModal v-else />
  </ModalLayout>
</template>

<style lang="scss" scoped>
.test-modal {
  width: 70%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  overflow-y: scroll;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__main {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .test-modal,
.modal-layout-leave-to .test-modal {
  transform: translateX(100%);
}
</style>
