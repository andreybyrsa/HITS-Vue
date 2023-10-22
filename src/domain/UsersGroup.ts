import RolesTypes from '@Domain/Roles'
import { User } from '@Domain/User'

interface UsersGroup {
  id: number
  name: string
  users: User[]
  roles: RolesTypes[]
}

export default UsersGroup
