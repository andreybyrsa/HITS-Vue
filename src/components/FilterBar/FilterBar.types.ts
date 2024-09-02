import { ComputedRef, Ref } from 'vue'

type FilterValue = string | number | boolean | object
type FilterChoice = {
  label: string
  value: FilterValue
  isMarked?: boolean
  click?: () => Promise<void>
}

interface Filter<DataType> {
  category: string
  isUniqueChoice: boolean
  choices: FilterChoice[]
  refValue: Ref<FilterValue | FilterValue[] | undefined>
  searchValue?: Ref<string>
  statement?: ComputedRef<boolean>
  checkFilter: (data: DataType, filter: FilterValue) => void
}

interface FilterBarProps<DataType> {
  className?: string
  title?: string
  filters: Filter<DataType>[]
  callback?: () => Promise<void>
}

export { FilterBarProps, Filter, FilterValue, FilterChoice }
