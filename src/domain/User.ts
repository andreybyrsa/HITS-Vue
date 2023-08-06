import RolesTypes from './Roles'

interface User {
  token: string
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
}

export { User, LoginUser, RegisterUser }
