import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

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
  (event: 'change', value: HTMLTargetEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { InputProps, InputEmits }
