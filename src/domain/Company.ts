import { User } from '@Domain/User'

interface Company {
  id: string
  name: string
  owner: User
  users: User[]
}

export default Company
