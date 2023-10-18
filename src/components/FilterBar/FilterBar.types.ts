interface FilterBarProps<FilterType> {
  filters: {
    category: string
    isUniqueChoice: boolean
    choices: FilterType[]
  }[]
}

export { FilterBarProps }
