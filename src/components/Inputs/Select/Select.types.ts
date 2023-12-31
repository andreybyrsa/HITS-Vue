import { ValidationMethods } from '@Utils/Validation'

interface OptionType {
  value: string | number | boolean
  label: string
}

interface SelectProps {
  className?: string
  labelClassName?: string
  name: string

  validation?: ValidationMethods
  validateOnUpdate?: boolean

  options: OptionType[]

  label?: string
  placeholder?: string
  error?: string

  disabled?: boolean

  hint?: string
}

export { SelectProps, OptionType }
