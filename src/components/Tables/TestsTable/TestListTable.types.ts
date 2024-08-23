import { Test, TestResult, TestAllResponse } from '@Domain/Test'

export interface TestListTableProps {
  tests: Test[]
}

// результаты юзеров по одному тесту
export interface AllTestResultProps {
  results: TestResult[]
}

// результаты всех юзеров по всем тестам
export interface TestsAllResultsProps {
  results: TestAllResponse[]
}
