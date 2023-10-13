import { Skill } from '@Domain/Skill'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'
import TeamMember from './TeamMember'

interface Team {
  id: string
  name: string
  closed: boolean
  createdAt: Date
  description: string
  owner: TeamMember
  leader: TeamMember
  members: TeamMember[]
  skills: Skill[]
  projects?: Project[]
}

export default Team
