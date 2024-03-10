import { RolesTypes } from '@Domain'

export interface UpdateUserData {
  email: string
  newEmail: string
  newFirstName: string
  newLastName: string
  newRoles: RolesTypes[]
}

export interface UpdateUserPassword {
  key: string
  email: string
  code: string
  password: string
}

export interface ChangeUserEmail {
  key: string
  oldEmail: string
  code: string
  password: string
  newEmail: string
  url: string
}
