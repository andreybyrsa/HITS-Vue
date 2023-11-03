import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import { ValidationMethods } from '@Utils/Validation'

interface InputProps {
  className?: string
  labelClassName?: string
  type?: string
  name: string

  validation?: ValidationMethods
  validateOnUpdate?: boolean
  noFormControlled?: boolean

  label?: string
  placeholder?: string

  prepend?: string
  append?: string
  error?: string

  disabled?: boolean
}

interface InputEmits {
  (event: 'input', value: HTMLTargetEvent): void
  (event: 'change', value: HTMLTargetEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'keydown', value: KeyboardEvent): void
}

export { InputProps, InputEmits }
