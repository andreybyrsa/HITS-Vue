import RolesTypes from './Roles'
import { Skill } from './Skill'

interface User {
  id: string
  token?: string
  username?: string
  email: string
  firstName: string
  lastName: string
  roles: RolesTypes[]
  role?: RolesTypes
  lastActivity?: Date
  skills?: Skill[]
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

export { User, LoginUser, RegisterUser }
