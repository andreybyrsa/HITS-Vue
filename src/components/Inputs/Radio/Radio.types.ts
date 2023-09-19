interface RadioProps {
  className?: string
  name: string

  validateOnUpdate?: boolean
  noFormCotrolled?: boolean

  label?: string

  value?: unknown

  error?: string
}

export default RadioProps
