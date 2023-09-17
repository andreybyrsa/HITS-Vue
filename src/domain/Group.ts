import { User } from './User'

interface UserGroup {
  id: string
  name: string
  users: User[]
  groupType: string
  isExperts?: boolean
  isProjectOffice?: boolean
}

export { UserGroup }
