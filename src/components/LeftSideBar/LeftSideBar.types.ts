import RolesTypes from '@Domain/Roles'

interface LeftSideBarTabType {
  id: number
  text: string
  to: string
  routes?: { id: number; to: string; text: string }[]
  iconName: string
  roles: RolesTypes[]
}

export default LeftSideBarTabType
