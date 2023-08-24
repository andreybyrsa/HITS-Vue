import { User } from './User'

interface UserGroup {
  id: number
  name: string
  users: User[]
}

export default UserGroup
