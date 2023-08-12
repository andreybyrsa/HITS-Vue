import RolesTypes from './Roles'

interface User {
  token?: string
  username?: string
  email: string
  firstName: string
  lastName: string
  roles: RolesTypes[]
  role?: RolesTypes
  lastActivity?: Date
}

interface LoginUser {
  email: string
  password: string
}

interface RegisterUser {
  email: string
  firstName: string
  lastName: string
  password: string
  roles: RolesTypes[]
}

interface UpdateUserData {
  email: string
  newEmail: string
  newFirstName: string
  newLastName: string
  newRoles: RolesTypes[]
}

export { User, LoginUser, RegisterUser, UpdateUserData }
