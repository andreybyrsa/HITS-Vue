interface InputProps {
  className?: string
  type?: string
  placeholder?: string
  prepend?: string
  prependIcon?: string
  append?: string
}

interface InputEmits {
  (event: 'update:modelValue', value: string): void
}

export { InputProps, InputEmits }
