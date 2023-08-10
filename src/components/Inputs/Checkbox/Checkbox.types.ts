interface CheckboxProps {
  className?: string
  name: string

  label?: string

  value?: number | string | boolean

  error?: string
}

interface CheckboxEmits {
  (event: 'change'): void
}

export { CheckboxProps, CheckboxEmits }
