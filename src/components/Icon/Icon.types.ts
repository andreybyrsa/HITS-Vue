interface IconProps {
  id?: string
  className?: string
}

interface IconEmits {
  (event: 'click'): void
}

export { IconProps, IconEmits }
