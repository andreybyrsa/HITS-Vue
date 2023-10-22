import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

interface Team {
  id: number
  name: string
  closed: boolean
  createdAt: Date
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
}

export default Team
