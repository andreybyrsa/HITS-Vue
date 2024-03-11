import { HTMLTargetEvent } from '@Domain'
import { ValidationMethods } from '@Utils'

export interface InputProps {
  className?: string
  labelClassName?: string
  type?: string
  name: string

  validation?: ValidationMethods
  validateOnUpdate?: boolean
  noFormControlled?: boolean
  max?: number
  min?: number
  label?: string
  placeholder?: string
  prepend?: string
  append?: string
  error?: string
  disabled?: boolean
  hint?: string
}

export interface InputEmits {
  (event: 'input', value: HTMLTargetEvent): void
  (event: 'change', value: HTMLTargetEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'keydown', value: KeyboardEvent): void
}
