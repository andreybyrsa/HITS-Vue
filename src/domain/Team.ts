import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'

interface Team {
  id: string
  name: string
  closed: boolean
  createdAt: Date
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
  projects?: Project[]
}

export default Team
