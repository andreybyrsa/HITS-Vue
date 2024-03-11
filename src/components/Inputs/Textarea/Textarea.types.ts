import { HTMLTargetEvent } from '@Domain'
import { ValidationMethods } from '@Utils'

export interface TextareaProps {
  className?: string
  labelClassName?: string
  name: string
  validation?: ValidationMethods
  validateOnUpdate?: boolean
  label?: string
  placeholder?: string
  prepend?: string
  append?: string
  error?: string
  disabled?: boolean
  hint?: string
}

export interface TextareaEmits {
  (event: 'change', value: HTMLTargetEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}
