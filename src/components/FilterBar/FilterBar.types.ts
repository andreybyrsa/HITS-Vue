import { Ref } from 'vue'

interface FilterBarProps<FilterType> {
  title: string
  filters: {
    category: string
    isUniqueChoice: boolean
    choices: { label: string; value: FilterType }[]
    refValue: Ref<FilterType | FilterType[] | undefined>
  }[]
}

export { FilterBarProps }
