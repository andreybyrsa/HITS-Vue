import { User } from '@Domain/User'

interface Company {
  id: number
  name: string
  createdAt: string
  membersCount: number
  owner: User
  members: User[]
}

export default Company
