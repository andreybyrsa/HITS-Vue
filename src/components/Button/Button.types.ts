import Colors from '@Domain/Colors'

type ButtonVariants = Colors | { [color in Colors]: `outline-${color}` }[Colors]

interface ButtonProps {
  id?: string
  className?: string
  maxWidth?: string
  variant?: ButtonVariants
  prependIconName?: string
  appendIconName?: string
  isLoading?: boolean
  disabled?: boolean
}

export { ButtonProps, ButtonVariants }
