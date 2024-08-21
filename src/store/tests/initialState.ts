import { Test, TestResult, TestAnswer, TestQuestion } from '@Domain/Test'

interface InitialState {
  tests: Test[],
  testresult: TestResult[],
  testQuestions: TestQuestion[],
}

export default InitialState
