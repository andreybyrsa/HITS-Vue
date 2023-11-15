import { Ref } from 'vue'

type FilterValue = string | number | boolean | object
type FilterChoice = { label: string; value: FilterValue }

interface Filter<DataType> {
  category: string
  isUniqueChoice: boolean
  choices: FilterChoice[]
  refValue: Ref<FilterValue | FilterValue[] | undefined>
  searchValue?: Ref<string>
  checkFilter: (data: DataType, filter: FilterValue) => void
}

interface FilterBarProps<DataType> {
  className?: string
  title?: string
  filters: Filter<DataType>[]
}

export { FilterBarProps, Filter, FilterValue, FilterChoice }
