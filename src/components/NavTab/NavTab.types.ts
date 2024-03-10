import { RolesTypes } from '@Domain'

export interface NavRoute {
  name: string
  to: string
  text: string
  iconName: string
  roles: RolesTypes[]
}

export interface NavTabProps {
  className?: string
  wrapperClassName?: string
  iconName?: string

  label?: string

  to: string
  routes?: NavRoute[]

  isActive?: boolean
}
