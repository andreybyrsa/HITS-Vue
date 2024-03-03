import { ComputedRef, Ref } from 'vue'

export type FilterValue = string | number | boolean | object
export type FilterChoice = { label: string; value: FilterValue; isMarked?: boolean }

export interface Filter<DataType> {
  category: string
  isUniqueChoice: boolean
  choices: FilterChoice[]
  refValue: Ref<FilterValue | FilterValue[] | undefined>
  searchValue?: Ref<string>
  statement?: ComputedRef<boolean>
  checkFilter: (data: DataType, filter: FilterValue) => void
}

export interface FilterBarProps<DataType> {
  className?: string
  title?: string
  filters: Filter<DataType>[]
}
