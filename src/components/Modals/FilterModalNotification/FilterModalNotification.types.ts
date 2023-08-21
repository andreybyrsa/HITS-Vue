interface FilterModalProps {
  isOpened: boolean
  currentFilters: string[]
}

interface FilterModalEmits {
  (event: 'close-modal', filters?: string[]): void
}

export { FilterModalProps, FilterModalEmits }
