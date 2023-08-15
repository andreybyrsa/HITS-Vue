import { ValidationMethods } from '@Utils/Validation'

interface InputProps {
  className?: string
  labelClassName?: string
  type?: string
  name: string

  validation?: ValidationMethods

  label?: string
  placeholder?: string

  prepend?: string
  append?: string
  error?: string

  disabled?: boolean
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

interface InputEmits {
  (event: 'change', value: HTMLInputEvent): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export { InputProps, InputEmits, HTMLInputEvent }
