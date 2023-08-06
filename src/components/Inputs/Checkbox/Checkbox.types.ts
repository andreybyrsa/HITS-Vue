interface CheckboxProps {
  className?: string
  label?: string
  value?: string
}

interface CheckboxEmits {
  (event: 'change'): void
}

export { CheckboxProps, CheckboxEmits }
