import {
  Test,
  TestResult,
  TestAnswer,
  TestQuestion,
  TestAllResponse,
} from '@Domain/Test'

interface InitialState {
  tests: Test[]
  testResult: TestResult[]
  testQuestions: TestQuestion[]
  results: TestAllResponse[]
}

export default InitialState
