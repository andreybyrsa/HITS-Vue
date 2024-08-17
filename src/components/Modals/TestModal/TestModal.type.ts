import { Test, TestResult } from '@Domain/Test'

export interface TestProps {
  test: Test
}

export interface TestHeaderEmits {
  (event: 'close-modal'): void
}

export interface TestResultProps {
  testResult: TestResult
}
