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

      <div class="d-flex flex-column gap-2">
        <Typography class-name="d-flex justify-content-center fs-6"
          >Инструкция</Typography
        >
        <Typography class-name="rounded-end">{{ test.description }}</Typography>
        <Typography class-name="text-primary"
          >Если вы покинете страницу прохождения теста до его завершения, ваши ответы
          не будут сохранены</Typography
        >
      </div>

      <div class="roundedp-1 border border-primary border-top-0 w-100"></div>

      <div
        v-for="(question, index) in testQuestions"
        :key="index"
        class="w-100 mb-3"
      >
        <div class="belbin-test-form__content">
          <Typography>{{ question.questionNumber }}.</Typography>
          <Typography>{{ question.question }}</Typography>
        </div>

        <div class="d-flex flex-row gap-4 m-3">
          <Radio
            :label="'Да'"
            :name="'question' + index"
            :checked="isAnswerSelected(question.id, '+')"
            @change="handleClick(question.id, '+')"
          />
          <Radio
            :label="'Нет'"
            :name="'question' + index"
            :checked="isAnswerSelected(question.id, '-')"
            @change="handleClick(question.id, '-')"
          />
        </div>
      </div>
      <Typography
        v-if="incompleteAnswers"
        class-name="text-danger"
      >
        Вы ответили не на все вопросы. Проверьте свои ответы, пожалуйста.
      </Typography>
      <Button
        variant="primary"
        :disabled="incompleteAnswers"
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
import Radio from '@Components/Inputs/Radio/Radio.vue'

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

type moduleAnswers = Record<string, string>
const answers = ref<moduleAnswers>({})

const currentModule = ref(0)

const getAnswersLength = (): number => {
  return Object.keys(answers.value).length
}

const handleClick = (questionId: string, value: string) => {
  answers.value[questionId] = value
}

const isAnswerSelected = (questionId: string, value: string) => {
  return answers.value[questionId] === value
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
  }
}

function navToResult(testName: string, userId: string) {
  router.push(`/tests/${testName}/result/${userId}`)
}
async function showResults(test: Test, userId: string) {
  submitAnswers()
  const currentUser = user.value
  if (testAnswers.value && currentUser?.token) {
    const { token } = currentUser
    await TestService.postTemperResult(testAnswers.value, token)
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
