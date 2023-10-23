import Filter from '@Components/Modals/FilterModal/Filter.types'

interface FilterModalProps<FilterType> {
  isOpened: boolean
  currentFilters: Filter<FilterType>[]
  filters?: Filter<FilterType>[]
}

interface FilterModalEmits<FilterType> {
  (event: 'close-modal'): void
  (event: 'set-filters', filters: Filter<FilterType>[]): void
}

export { FilterModalProps, FilterModalEmits }
