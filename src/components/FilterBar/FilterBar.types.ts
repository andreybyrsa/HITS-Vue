import { Ref } from 'vue'

type FilterValue = string | number | boolean | object

interface Filter<DataType> {
  category: string
  isUniqueChoice: boolean
  choices: { label: string; value: FilterValue }[]
  refValue: Ref<FilterValue | FilterValue[] | undefined>
  statement: () => boolean
  checkFilter: (data: DataType, filter: FilterValue) => void
}

interface FilterBarProps<DataType> {
  className?: string
  title?: string
  filters: Filter<DataType>[]
}

export { FilterBarProps, Filter, FilterValue }
