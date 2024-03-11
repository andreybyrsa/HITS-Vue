import { User, RolesTypes } from '@Domain'

export interface UsersGroup {
  id: string
  name: string
  users: User[]
  roles: RolesTypes[]
}
