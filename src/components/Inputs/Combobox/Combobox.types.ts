interface ComboboxProps<OptionType> {
  name: string

  options: OptionType[]
  displayBy?: (keyof OptionType)[]

  noFormControlled?: boolean

  label?: string
  placeholder?: string
  multiselectPlaceholder?: string
}

interface ComboboxEmits<OptionType> {
  (event: 'onSelect', value: OptionType): void
  (event: 'onUnselect', value: OptionType): void
}

interface SearchedOptionType<OptionType> {
  label: string
  option: OptionType
}

export { ComboboxProps, ComboboxEmits, SearchedOptionType }
