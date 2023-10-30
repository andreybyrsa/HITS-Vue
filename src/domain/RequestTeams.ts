import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

interface RequestTeams {
  ideaId: number
  accepted: boolean
  letter: string

  id: number
  name: string
  createdAt: string
  closed: boolean
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
}

export default RequestTeams
