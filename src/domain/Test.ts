import { User } from '@Domain/User'

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
  result: string
}

interface TestAllResponse {
  user: User
  belbinTest: TestResult
  temperTest: TestResult
  mindTest: TestResult
}
export { Test, TestQuestion, TestAnswer, TestResult, TestAllResponse }
