import { Skill } from '@Domain/Skill'
import TeamMember from '@Domain/TeamMember'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'

interface Team {
  id: string
  name: string
  createdAt: string

  description: string
  closed: boolean
  membersCount: number
  owner: TeamMember
  leader?: TeamMember
  members: TeamMember[]
  skills: Skill[]
  projects?: Project[]
}

export default Team
