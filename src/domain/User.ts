import RolesTypes from './Roles'

interface User {
  token: string
  username: string
  firstName: string
  lastName: string
  password: string
  roles: RolesTypes[]
  role?: RolesTypes
}

export default User
