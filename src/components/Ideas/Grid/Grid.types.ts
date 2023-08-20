import { Idea } from '@Domain/Idea'

interface GridProps {
  data?: Idea[]
  columns: string[]
  filterKey?: string
  selectedFilters?: string[]
}

interface GridEmits {
  (event: 'close-modal'): void
  (event: 'remove-email', index: number): void
  (event: 'set-idea', idea: Idea): void
}

export { GridProps, GridEmits }
