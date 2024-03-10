import { Colors } from '@Domain'

export type ButtonVariants =
  | Colors
  | { [color in Colors]: `outline-${color}` }[Colors]

export interface ButtonProps {
  id?: string
  className?: string
  variant?: ButtonVariants
  prependIconName?: string
  appendIconName?: string
  isLoading?: boolean
}
