interface InputProps {
  className?: string
  type?: string
  placeholder?: string
}

interface InputEmits {
  (event: 'update:modelValue', value: string): void
}

export { InputProps, InputEmits }
