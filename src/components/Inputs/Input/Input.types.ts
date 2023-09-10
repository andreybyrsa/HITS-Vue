import HTMLInputEvent from '@Domain/HTMLInputEvent'

import { ValidationMethods } from '@Utils/Validation'

interface InputProps {
  className?: string
  labelClassName?: string
  type?: string
  name: string

  validation?: ValidationMethods
  validateOnUpdate?: boolean

  label?: string
  placeholder?: string

  prepend?: string
  append?: string
  error?: string

  disabled?: boolean
}

interface InputEmits {
  (event: 'change', value: HTMLInputEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { InputProps, InputEmits }
