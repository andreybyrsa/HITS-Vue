import RolesTypes from './Roles'
import { User } from './User'

interface UserGroup {
  id: string
  name: string
  users: User[]
  roles: RolesTypes
  isExperts?: boolean
  isProjectOffice?: boolean
}

export { UserGroup }
