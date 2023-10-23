import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

interface ApplicationTeams {
  id: number
  ideaId: number
  accepted: boolean

  name: string
  status: string
  changedDate: string
  closed: boolean
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
  letter: string
}

export default ApplicationTeams
