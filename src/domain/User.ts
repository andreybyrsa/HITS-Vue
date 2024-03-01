import {RolesTypes} from '@Domain'

export interface User {
  id: string
  token?: string

  email: string
  firstName: string
  lastName: string
  createdAt?: string

  roles: RolesTypes[]
  role?: RolesTypes
  lastLogin?: Date
}

export interface LoginUser {
  email: string
  password: string
}

export interface RegisterUser {
  email: string
  firstName: string
  lastName: string
  password: string
  roles: RolesTypes[]
}
