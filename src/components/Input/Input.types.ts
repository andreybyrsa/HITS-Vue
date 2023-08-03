interface InputProps {
  className?: string
  type?: string
  value?: string
  placeholder?: string
  label?: string
  prepend?: string
  append?: string
}

interface InputEmits {
  (event: 'update:value', value: string): void
}

export { InputProps, InputEmits }
