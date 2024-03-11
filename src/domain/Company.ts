import { User } from '@Domain'

export interface Company {
  id: string
  name: string
  owner: User
  users: User[]
}
