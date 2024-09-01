import { User } from '@Domain/User'

type TestFilter =
  | 'ALL'
  | 'SYNTHETIC'
  | 'IDEALISTIC'
  | 'PRAGMATIC'
  | 'ANALYTICAL'
  | 'REALISTIC'

interface Test {
  id: string
  testName: string
  name: string
  description: string
}

interface TestQuestion {
  id: string
  testName: string
  questionNumber: number
  questionName: string
  questionModuleNumber: number
  questionModule: string
  question: string
}

interface TestAnswer {
  id: string
  testName: string
  user: User
  questionName: string
  questionModuleNumber: number
  questionNumber: number
  answer: string
}

interface TestResult {
  id: string
  user: User
  testName: string
  testResult: string
}

interface TestAllResponse {
  user: User
  belbinResult: string
  temperResult: string
  mindResult: string
}
export { Test, TestQuestion, TestAnswer, TestResult, TestAllResponse, TestFilter }
