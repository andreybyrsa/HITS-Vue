import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import { ValidationMethods } from '@Utils/Validation'

interface TextareaProps {
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

interface TextareaEmits {
  (event: 'change', value: HTMLTargetEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { TextareaProps, TextareaEmits }
