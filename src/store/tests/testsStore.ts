import { defineStore } from 'pinia'

import TestService from '@Services/TestService'

import InitialState from '@Store/tests/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import findOneAndUpdate from '@Utils/findOneAndUpdate'

import { User } from '@Domain/User'
import { Test, TestQuestion, TestAnswer, TestResult } from '@Domain/Test'

const useTestStore = defineStore('tests', {
  state: (): InitialState => ({
    tests: [],
  }),

  getters: {
    getAllTests() {
      return async (token: string) => {
        const response = await TestService.getAllTests(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
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
      }
    },
    getTestAnswers() {
      return async (testName: string, token: string) => {
        const response = await TestService.getTestAnswers(testName, token)

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
      return async (testName: string, token: string) => {
        const response = await TestService.getTestResult(testName, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }
      }
    },
  },
})

export default useTestStore
