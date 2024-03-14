import RolesTypes from '@Domain/Roles'

interface User {
  id: string
  token?: string

  email: string
  firstName: string
  lastName: string
  createdAt?: string

  roles: RolesTypes[]
  role?: RolesTypes
  lastLogin?: Date

  telephone: string
  studyGroup: string
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
  telephone: string
  studyGroup: string
}

export { User, LoginUser, RegisterUser }
