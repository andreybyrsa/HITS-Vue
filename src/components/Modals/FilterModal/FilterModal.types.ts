interface FilterModalProps {
  isOpened: boolean
  currentFilters: string[]
}

interface FilterModalEmits {
  (event: 'close-modal'): void
  (event: 'set-filters', filters: string[]): void
}

export { FilterModalProps, FilterModalEmits }
