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

interface ChangeUserEmail {
  key: string
  oldEmail: string
  code: string
  password: string
  newEmail: string
  url: string
}

interface UserGroupData {
  id: number
  name: string
  users: User[]
  isExsperts?: boolean
  isProjectOffice?: boolean
}

export { UpdateUserData, UpdateUserPassword, ChangeUserEmail, UserGroupData }
