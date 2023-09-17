interface ComboboxProps<OptionType> {
  name: string

  options: OptionType[]
  displayBy?: (keyof OptionType)[]

  label?: string
  placeholder?: string
}

interface SearchedOptionType<OptionType> {
  label: string
  option: OptionType
}

export { ComboboxProps, SearchedOptionType }
