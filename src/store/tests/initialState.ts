import {
  Test,
  TestResult,
  TestAnswer,
  TestQuestion,
  TestAllResponse,
} from '@Domain/Test'

interface InitialState {
  tests: Test[]
  testresult: TestResult[]
  testQuestions: TestQuestion[]
  results: TestAllResponse[]
}

export default InitialState
