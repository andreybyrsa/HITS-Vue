import RolesTypes from './Roles'
import { User } from '@Domain/User'

interface UpdateUserData {
  email: string
  newEmail: string
  newFirstName: string
  newLastName: string
  newRoles: RolesTypes[]
}

interface UpdateUserPassword {
  key: string
  email: string
  code: string
  password: string
}

interface UserGroupData {
  id: number
  name: string
  users: User[]
  isExsperts?: boolean
  isProjectOffice?: boolean
}

export { UpdateUserData, UpdateUserPassword, UserGroupData }
