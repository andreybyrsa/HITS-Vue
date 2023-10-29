import { Ref } from 'vue'

type FilterValue = string | number | boolean | object

interface Filter {
  category: string
  isUniqueChoice: boolean
  choices: { label: string; value: FilterValue }[]
  refValue: Ref<FilterValue | FilterValue[] | undefined>
}

interface FilterBarProps {
  className?: string
  title?: string
  filters: Filter[]
}

export { FilterBarProps, Filter, FilterValue }
