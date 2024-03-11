import { ValidationMethods } from '@Utils'

export interface OptionType {
  value: string | number | boolean
  label: string
}

export interface SelectProps {
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
