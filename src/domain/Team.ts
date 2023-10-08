import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

interface Team {
  id: string
  name: string
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
}

export default Team
