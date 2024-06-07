import HTMLTargetEvent from '@Domain/HTMLTargetEvent'
import { ValidationMethods } from '@Utils/Validation'

interface ComboboxProps<OptionType> {
  name: string

  options: OptionType[]
  displayBy?: (keyof OptionType)[]
  comparingKey?: keyof OptionType

  noFormControlled?: boolean

  label?: string
  hint?: string
  placeholder?: string
  multiselectPlaceholder?: string
  disabled?: boolean

  error?: string
  className?: string
  validation?: ValidationMethods
  validateOnUpdate?: boolean
}

interface ComboboxEmits<OptionType> {
  (event: 'addNewOption', optionName: string): void
  (event: 'onSelect', value: OptionType): void
  (event: 'onUnselect', value: OptionType): void
  (event: 'change', value: HTMLTargetEvent): void
}

interface SearchedOptionType<OptionType> {
  label: string
  option: OptionType
}

export { ComboboxProps, ComboboxEmits, SearchedOptionType }
