interface InputProps {
  className?: string
  type?: string
  placeholder?: string
  prepend?: string
  append?: string
}

interface InputEmits {
  (event: 'change'): void
}

export { InputProps, InputEmits }
