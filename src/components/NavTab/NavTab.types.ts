import RolesTypes from '@Domain/Roles'

interface NavRoute {
  id: number
  to: string
  text: string
  iconName: string
  roles: RolesTypes[]
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
