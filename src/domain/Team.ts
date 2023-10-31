import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'

interface Team {
  id: number
  name: string
  createdAt: string
  description: string
  closed: boolean
  membersCount: number
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
  projects?: Project[]
}

export default Team
