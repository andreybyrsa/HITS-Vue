import RolesTypes from '@Domain/Roles'
import { User } from '@Domain/User'

interface UserGroup {
  id: string
  name: string
  users: User[]
  role: RolesTypes
}

export default UserGroup
