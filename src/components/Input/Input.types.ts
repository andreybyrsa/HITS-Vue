interface InputProps {
  className?: string
  type?: string
  placeholder?: string
  label?: string
  prepend?: string
  append?: string
}

interface InputEmits {
  (event: 'update:modelValue', value: string): void
}

export { InputProps, InputEmits }
