import { User } from './User'

interface UserGroup {
  id: string
  name: string
  users: User[]
  isExperts?: boolean
  isProjectOffice?: boolean
}

interface UpdateUserGroup {
  id: string
  newName: string
  newUsers: User[]
}

export { UserGroup, UpdateUserGroup }
