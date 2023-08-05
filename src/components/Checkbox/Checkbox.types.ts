interface CheckboxProps {
  className?: string
  label?: string
}

interface CheckboxEmits {
  (event: 'click'): void
}

export { CheckboxProps, CheckboxEmits }
