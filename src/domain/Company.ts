import { User } from '@Domain/User'

interface Company {
  id: number
  name: string
  owner: User
  members: User[]
}

export default Company
