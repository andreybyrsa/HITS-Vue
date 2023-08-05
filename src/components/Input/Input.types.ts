interface InputProps {
  className?: string
  type?: string
  value?: string
  placeholder?: string
  prepend?: string
  append?: string
}

interface InputEmits {
  (event: 'update:value', value: string): void
  (event: 'change'): void
}

export { InputProps, InputEmits }
