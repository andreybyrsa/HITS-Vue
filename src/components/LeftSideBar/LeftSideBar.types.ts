import { NavRoute } from '@Components/NavTab/NavTab.types'

import RolesTypes from '@Domain/Roles'

interface LeftSideBarTabType {
  id: number
  text: string
  to: string
  routes?: NavRoute[]
  iconName: string
  roles: RolesTypes[]
}

export default LeftSideBarTabType
