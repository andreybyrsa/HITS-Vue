interface CheckboxProps {
  className?: string

  name: string

  validateOnUpdate?: boolean
  noFormControlled?: boolean

  label?: string

  value?: unknown
  checked?: boolean

  error?: string
}

export default CheckboxProps
