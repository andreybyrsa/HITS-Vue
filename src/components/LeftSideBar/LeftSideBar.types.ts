import { RolesTypes } from '@Domain'
import { NavRoute } from '@Components/NavTab/NavTab.types'

export interface LeftSideBarTabType {
  name: string
  text: string
  to: string
  routes?: NavRoute[]
  iconName: string
  roles: RolesTypes[]
}
