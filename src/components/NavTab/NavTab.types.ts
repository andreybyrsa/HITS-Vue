interface NavTabProps {
  className?: string
  iconName?: string
  to: string
  routes?: { id: number; to: string; text: string }[]
  isActive?: boolean
}

export default NavTabProps
