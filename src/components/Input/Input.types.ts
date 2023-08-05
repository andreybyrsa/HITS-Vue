interface InputProps {
  className?: string
  type?: string
  value?: string
  placeholder?: string
  prepend?: string
  prependIcon?: string
  append?: string
}

interface InputEmits {
  (event: 'update:value', value: string): void
}

export { InputProps, InputEmits }
