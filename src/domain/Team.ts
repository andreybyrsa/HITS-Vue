import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

interface Team {
  id: string
  name: string
  createdAt: string
  description: string
  closed: boolean
  membersCount: number
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
  wantedSkills: Skill[]
}

export default Team
