import { User } from './User'

interface UserGroup {
  id: number
  name: string
  users: User[]
}

interface UpdateUserGroup {
  id: number
  newName: string
  newUsers: User[]
}

export { UserGroup, UpdateUserGroup }
