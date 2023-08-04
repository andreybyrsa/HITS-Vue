import RolesTypes from './Roles'

interface User {
  token: string
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  roles: RolesTypes[]
  role?: RolesTypes
}
interface LoginUser {
  username: string
  password: string
}
export { User, LoginUser }
