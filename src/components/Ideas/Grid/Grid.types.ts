interface GridProps {
  data?: Date[]
  columns: string[]
  filterKey?: string
}

interface GridEmits {
  (event: 'close-modal'): void
  (event: 'remove-email', index: number): void
}

export { GridProps, GridEmits }
