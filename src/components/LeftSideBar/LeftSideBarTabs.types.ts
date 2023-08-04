import RolesTypes from '@Domain/Roles'

interface LeftSideBarTabsType {
  id: number
  text: string
  to: string
  routes?: { id: number; to: string; text: string }[]
  iconName: string
  roles: RolesTypes[]
}

export default LeftSideBarTabsType
