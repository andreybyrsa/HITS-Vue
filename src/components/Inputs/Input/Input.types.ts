import { ValidationMethods } from '@Utils/Validation'

interface InputProps {
  className?: string
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

export { InputProps, HTMLInputEvent }
