import RolesTypes from './Roles'

interface UpdateUserData {
  email: string
  newEmail: string
  newFirstName: string
  newLastName: string
  newRoles: RolesTypes[]
}

export { UpdateUserData }
