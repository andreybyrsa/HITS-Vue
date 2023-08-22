import RolesTypes from './Roles'

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

export { UpdateUserData, UpdateUserPassword, ChangeUserEmail }
