import RolesTypes from '@Domain/Roles'
import { User } from '@Domain/User'

interface UsersGroup {
  id: string
  name: string
  users: User[]
  roles: RolesTypes[]
}

export default UsersGroup
