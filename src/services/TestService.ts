import { Test, TestQuestion, TestAnswer, TestResult } from '@Domain/Test'
import Success from '@Domain/ResponseMessage'
import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import {
  testMocks,
  testQuestionsMocks,
  testAnswerMocks,
  testResultMocks,
} from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import axios from 'axios'
import { API_URL, MODE } from '@Main'

const testMocksAxios = defineAxios(testMocks)
const testQuestionsMocksAxios = defineAxios(testQuestionsMocks)
const testAnswerMocksAxios = defineAxios(testAnswerMocks)
const testResultMocksAxios = defineAxios(testResultMocks)

function formatTestQuestions(
  testName: string,
  questionModuleNumber: number,
  questions: TestQuestion[],
) {
  return questions.filter((question) => {
    return (
      question.testName === testName &&
      question.questionModuleNumber === questionModuleNumber
    )
  })
}

// --- Get --- //

const getAllTests = async (token: string): Promise<Test[] | Error> => {
  return testMocksAxios
    .get(`/ideas-service/test/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения тестов'))
}

const getTest = async (testName: string, token: string): Promise<Test | Error> => {
  return testMocksAxios
    .get<Test>(
      `/ideas-service/test/${testName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { testName } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки теста'))
}

const getTestQuestions = async (
  testName: string,
  questionModuleNumber: number,
  token: string,
): Promise<TestQuestion[] | Error> => {
  return testQuestionsMocksAxios
    .get<TestQuestion[]>(
      `/api/v1/ideas-service/test/${testName}/questions/${questionModuleNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (questions) =>
          formatTestQuestions(testName, questionModuleNumber, questions),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки вопросов'))
}

const getTestAnswers = async (
  testName: string,
  token: string,
): Promise<TestAnswer[] | Error> => {
  return testAnswerMocksAxios
    .get(`/api/v1/ideas-service/test/${testName}/answers`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения ответов'))
}

const getTestResult = async (
  testName: string,
  token: string,
): Promise<TestResult | Error> => {
  return testResultMocksAxios
    .get(
      `/api/v1/ideas-service/test/${testName}/result`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { testName } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения результата'))
}

// --- Post --- //

const postBelbinResult = async (
  answers: TestAnswer[],
  token: string,
): Promise<{ createResult: string } | Error> => {
  return axios
    .post(`/api/v1/ideas-service/test/result/belbin`, answers, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания результатов'))
}

const postTemperResult = async (
  answers: TestAnswer[],
  token: string,
): Promise<{ createResult: string } | Error> => {
  return axios
    .post(`/api/v1/ideas-service/test/result/temper`, answers, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания результатов'))
}

const postMindResult = async (
  answers: TestAnswer[],
  token: string,
): Promise<{ createResult: string } | Error> => {
  return axios
    .post(`/api/v1/ideas-service/test/result/mind`, answers, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания результатов'))
}

const TestService = {
  getAllTests,
  getTest,
  getTestQuestions,
  getTestAnswers,
  getTestResult,

  postBelbinResult,
  postTemperResult,
  postMindResult,
}

export default TestService
