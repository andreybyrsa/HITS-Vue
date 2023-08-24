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

interface HTMLTextareaEvent extends Event {
  target: HTMLTextAreaElement & EventTarget
}

interface TextareaEmits {
  (event: 'change', value: HTMLTextareaEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { TextareaProps, TextareaEmits, HTMLTextareaEvent }
