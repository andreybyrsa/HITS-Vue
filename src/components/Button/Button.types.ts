import Colors from '@Domain/Colors'

interface ButtonProps {
  id?: string
  className?: string
  variant?: Colors | { [color in Colors]: `outline-${color}` }[Colors]
  prependIconName?: string
  appendIconName?: string
  isLoading?: boolean
}

export default ButtonProps
