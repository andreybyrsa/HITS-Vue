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

  options: OptionType[]

  label?: string
  placeholder?: string
  error?: string

  disabled?: boolean
}

export { SelectProps, OptionType }
