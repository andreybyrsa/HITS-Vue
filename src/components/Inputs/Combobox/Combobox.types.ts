interface ComboboxProps<OptionType> {
  name: string

  options: OptionType[]
  displayBy?: (keyof OptionType)[]
  comparingKey?: keyof OptionType

  noFormControlled?: boolean

  label?: string
  placeholder?: string
  multiselectPlaceholder?: string
  disabled?: boolean
}

interface ComboboxEmits<OptionType> {
  (event: 'addNewOption', optionName: string): void
  (event: 'onSelect', value: OptionType): void
  (event: 'onUnselect', value: OptionType): void
}

interface SearchedOptionType<OptionType> {
  label: string
  option: OptionType
}

export { ComboboxProps, ComboboxEmits, SearchedOptionType }
