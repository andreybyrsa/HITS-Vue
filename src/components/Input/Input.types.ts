interface InputProps {
  className?: string
  label?: string
  type?: string
  value?: string
  placeholder?: string
  prepend?: string
  append?: string
}

interface InputEmits {
  (event: 'update:value', value: string): void
  (event: 'click'): void
  (event: 'change'): void
}

export { InputProps, InputEmits }
