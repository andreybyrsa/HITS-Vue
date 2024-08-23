import { Test, TestResult, TestAllResponse } from '@Domain/Test'

export interface TestListTableProps {
  tests: Test[]
}

// результаты юзеров по одному тесту
export interface AllTestResultProps {
  results: TestResult[]
}

export interface TestsAllResultsProps {
  results: TestAllResponse[]
}
