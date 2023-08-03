interface ButtonProps {
  className: string
  iconName?: string
}

interface ButtonEmits {
  (event: 'click'): void
}

export { ButtonProps, ButtonEmits }
