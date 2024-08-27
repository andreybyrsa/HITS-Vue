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
        {{ currentModule }} часть из 18
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
        <div class="belbin-test-form__content d-flex justify-content-center">
          <Typography>{{ question.questionNumber }}.</Typography>
          <Typography>{{ question.question }}</Typography>
        </div>
        <div class="d-flex justify-content-center mt-2">
          <div
            v-for="score in availableScores"
            :key="score"
            class="mx-1"
            @click="handleButtonClick(question.id, score)"
          >
            <Button
              :variant="isAnswerSelected(question.id, score) ? 'primary' : 'light'"
              class="rounded-circle"
            >
              {{ score }}
            </Button>
          </div>
        </div>
      </div>
      <Typography
        v-if="!areAnswersUnique"
        class-name="text-danger"
      >
        Каждый балл используется лишь раз. Проверьте свои ответы, пожалуйста.
      </Typography>
      <Typography
        v-if="incompleteAnswers"
        class-name="text-danger"
      >
        Вы ответили не на все вопросы.
      </Typography>
      <Button
        v-if="currentModule !== 18"
        :disabled="!areAnswersUnique || incompleteAnswers"
        variant="primary"
        @click="nextModule"
      >
        Далее
      </Button>
      <Button
        v-if="currentModule === 18"
        :disabled="!areAnswersUnique || incompleteAnswers"
        variant="primary"
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

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

const test = ref<Test>()
const testQuestions = ref<TestQuestion[]>()
const testAnswers = ref<TestAnswer[]>([])
const availableScores = [1, 2, 3, 4, 5]
type moduleAnswers = Record<string, number>
const answers = ref<moduleAnswers>({})

const currentModule = ref(1)
const currentQuestionName = ref()

const handleButtonClick = (questionId: string, value: number) => {
  answers.value[questionId] = value
}

const isAnswerSelected = (questionId: string, value: number) => {
  return answers.value[questionId] === value
}

const areAnswersUnique = computed(() => {
  const values = Object.values(answers.value)
  return values.length === new Set(values).size
})

const getAnswersLength = (): number => {
  return Object.keys(answers.value).length
}

const incompleteAnswers = computed(() => {
  return getAnswersLength() !== testQuestions.value?.length
})

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

const resetAnswers = () => {
  answers.value = {}
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

      isLoading.value = true

      const testParallelRequests: RequestConfig[] = [
        {
          request: () => TestService.getTest(testName, token),
          refValue: test,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () =>
            TestService.getTestQuestions(testName, currentModule.value, token),
          refValue: testQuestions,
          onErrorFunc: openErrorNotification,
        },
      ]

      await sendParallelRequests(testParallelRequests)

      isLoading.value = false
    }

    resetAnswers()

    if (testQuestions.value) {
      testQuestions.value.forEach((question) => {
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
    await TestService.postMindResult(testAnswers.value, token)
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
    @include flexible(center, flex-start, row, $gap: 16px);
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
