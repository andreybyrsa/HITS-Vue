interface RadioProps {
  className?: string
  name: string

  validateOnUpdate?: boolean
  noFormCotrolled?: boolean

  label?: string

  value?: unknown
  checked?: boolean

  error?: string
}

export default RadioProps
