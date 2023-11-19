import { User } from '@Domain/User'

interface Company {
  id: number
  name: string
  owner: User
  users: User[]
}

export default Company
