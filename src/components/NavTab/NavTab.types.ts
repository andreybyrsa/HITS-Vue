interface NavRoute {
  id: number
  to: string
  text: string
  iconName: string
}

interface NavTabProps {
  className?: string
  wrapperClassName?: string
  iconName?: string

  label?: string

  to: string
  routes?: NavRoute[]

  isActive?: boolean
}

export { NavTabProps, NavRoute }
