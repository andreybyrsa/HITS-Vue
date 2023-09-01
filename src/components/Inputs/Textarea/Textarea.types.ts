import HTMLInputEvent from '@Domain/HTMLInputEvent'

import { ValidationMethods } from '@Utils/Validation'

interface TextareaProps {
  className?: string
  labelClassName?: string
  name: string

  validation?: ValidationMethods

  label?: string
  placeholder?: string

  prepend?: string
  append?: string
  error?: string

  disabled?: boolean
}

interface TextareaEmits {
  (event: 'change', value: HTMLInputEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { TextareaProps, TextareaEmits }
