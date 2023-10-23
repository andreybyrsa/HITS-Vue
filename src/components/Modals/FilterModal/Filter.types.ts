interface FilterModalProps<FilterType> {
  id: number
  key: keyof FilterType
  label?: string
  value?: string | number

  valueDrop?: string[]
}

export default FilterModalProps
