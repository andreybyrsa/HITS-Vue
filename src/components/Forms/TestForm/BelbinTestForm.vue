<template>
  <div class="belbin-test-form w-100 h-100 bg-white p-3 overflow-auto">
    <div
      v-if="test && testQuestions"
      class="belbin-test-form__header w-75"
      id="my-target-section"
    >
      <Typography class-name="fs-2 text-primary">
        {{ test?.name }}
      </Typography>

      <div
        v-if="currentModule === 1"
        class="d-flex flex-column gap-2"
      >
        <Typography class-name="d-flex justify-content-center fs-6">
          Инструкция
        </Typography>
        <Typography class-name="rounded-end">
          {{ test?.description }}
        </Typography>
        <Typography class-name="text-primary"
          >Если вы покинете страницу прохождения теста до его завершения, ваши ответы
          не будут сохранены</Typography
        >
      </div>
      <div class="roundedp-1 border border-primary border-top-0 w-100"></div>
      <Typography class-name="text-primary">
        {{ currentModule }} часть из 7
      </Typography>
      <div class="d-flex justify-content-center">
        <Typography class-name="fs-4 text-primary">{{
          currentQuestionName
        }}</Typography>
      </div>
      <div
        v-for="(question, index) in testQuestions"
        :key="index"
        class="w-100 mb-3"
      >
        <div class="belbin-test-form__content">
          <Typography>{{ index + 1 }}.</Typography>
          <Typography>{{ question.question }}</Typography>
        </div>
        <div class="d-flex justify-content-center mt-2">
          <div
            v-for="i in 11"
            :key="i"
            class="mx-1"
            @click="handleButtonClick(question.id, i - 1)"
          >
            <Button
              :variant="isAnswerSelected(question.id, i - 1) ? 'primary' : 'light'"
              class="rounded-circle"
            >
              {{ i - 1 }}
            </Button>
          </div>
        </div>
      </div>
      <Typography
        v-if="maxSumModule !== totalSum"
        class-name="text-danger"
      >
        Сумма баллов не {{ maxSumModule }}. Ваша Сумма: {{ totalSum }}
      </Typography>
      <Button
        v-if="currentModule !== 7"
        :disabled="totalSum !== maxSumModule"
        variant="primary"
        @click="nextModule"
      >
        Далее
      </Button>
      <Button
        v-if="currentModule === 7"
        variant="primary"
        :disabled="totalSum !== maxSumModule"
        @click="showResults(test, user!.id)"
      >
        Результат
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import { Test, TestQuestion, TestAnswer } from '@Domain/Test'

import TestService from '@Services/TestService'
import useTestStore from '@Store/tests/testsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const testStore = useTestStore()

const route = useRoute()
const router = useRouter()

const test = ref<Test>()
const testQuestions = ref<TestQuestion[]>()
const testAnswers = ref<TestAnswer[]>([])

type moduleAnswers = Record<string, number>
const answers = ref<moduleAnswers>({})

const maxSumModule = 10

const currentModule = ref(1)
const currentQuestionName = ref()

const handleButtonClick = (questionId: string, value: number) => {
  answers.value[questionId] = value
}

const totalSum = computed(() => {
  let sum = 0
  for (const value of Object.values(answers.value)) {
    sum += value
  }
  return sum
})

const isAnswerSelected = (questionId: string, value: number) => {
  return answers.value[questionId] === value
}

const submitAnswers = () => {
  const currentUser = user.value
  if (testQuestions.value && currentUser) {
    testQuestions.value.forEach((question) => {
      const answer = answers.value[question.id]
      if (typeof answer !== 'undefined') {
        testAnswers.value.push({
          id: '',
          testName: question.testName,
          user: currentUser,
          questionName: question.questionName,
          questionModuleNumber: question.questionModuleNumber,
          questionNumber: question.questionNumber,
          answer: answer.toString(),
        })
      }
    })
  }
}

const resetTotalSum = () => {
  for (const key in answers.value) {
    answers.value[key] = 0
  }
}

watch(
  () => currentModule.value,
  async (newValue) => {
    ;(currentModule.value = newValue), await getTestForm()
  },
)

watchImmediate(
  () => route.params.testName,
  async () => {
    await getTestForm()
  },
)

async function getTestForm() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    if (route.params.testName) {
      const testName = route.params.testName.toString()

      const testParallelRequests: RequestConfig[] = [
        {
          request: () => testStore.getTest(testName, token),
          refValue: test,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () =>
            testStore.getTestQuestions(testName, currentModule.value, token),
          refValue: testQuestions,
          onErrorFunc: openErrorNotification,
        },
      ]

      await sendParallelRequests(testParallelRequests)
    }

    resetTotalSum()

    if (testQuestions.value) {
      testQuestions.value.forEach((question) => {
        answers.value[question.id] = 0
        currentQuestionName.value = question.questionModule
      })
    }
  }
}

const scrollToTop = () => {
  document
    .getElementById('my-target-section')!
    .scrollIntoView({ behavior: 'smooth' })
}

function nextModule() {
  currentModule.value += 1
  submitAnswers()
  scrollToTop()
}

function navToResult(testName: string, userId: string) {
  router.push(`/tests/${testName}/result/${userId}`)
}
async function showResults(test: Test, userId: string) {
  submitAnswers()
  const currentUser = user.value
  if (testAnswers.value && currentUser?.token) {
    const { token } = currentUser
    await TestService.postBelbinResult(testAnswers.value, token)
  }
  navToResult(test.testName, userId)
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
