import { User } from './User'

interface UserGroup {
  id: string
  name: string
  users: User[]
  isExperts?: boolean
  isProjectOffice?: boolean
}

export { UserGroup }
