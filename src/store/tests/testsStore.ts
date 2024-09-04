import { defineStore } from 'pinia'

import TestService from '@Services/TestService'

import InitialState from '@Store/tests/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import findOneAndUpdate from '@Utils/findOneAndUpdate'

import { User } from '@Domain/User'
import {
  Test,
  TestQuestion,
  TestAnswer,
  TestResult,
  TestAllResponse,
  TestFilter,
} from '@Domain/Test'

const useTestStore = defineStore('tests', {
  state: (): InitialState => ({
    tests: [],
    testResult: [], // все результаты по одному тесту
    testQuestions: [],
    results: [], // все результаты по всем тестам
  }),

  getters: {
    getAllTests() {
      return async (token: string) => {
        const response = await TestService.getAllTests(token)

        if (response instanceof Error) {
          return response
        }

        this.tests = response
        return this.tests
      }
    },
    getTest() {
      return async (testName: string, token: string) => {
        const response = await TestService.getTest(testName, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        const test = this.tests.find((test) => test?.testName === testName)
        if (test) {
          return test
        }
      }
    },
    getTestQuestions() {
      return async (testName: string, moduleNumber: number, token: string) => {
        const response = await TestService.getTestQuestions(
          testName,
          moduleNumber,
          token,
        )

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.testQuestions = response
        return this.testQuestions
      }
    },
    getTestAnswers() {
      return async (testName: string, userId: string, token: string) => {
        const response = await TestService.getTestAnswers(testName, userId, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }
      }
    },
    getTestResult() {
      return async (testName: string, userId: string, token: string) => {
        const response = await TestService.getTestResult(testName, userId, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        return response
      }
    },
    getAllTestResult() {
      return async (testName: string, token: string) => {
        const response = await TestService.getAllTestResult(testName, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.testResult = response
        return this.testResult
      }
    },
    getTestGeneral() {
      return async (target: TestFilter, token: string) => {
        const response = await TestService.getTestGeneral(target, token)

        if (response instanceof Error) {
          return response
        }

        this.results = response
        return this.results
      }
    },
  },
})

export default useTestStore
