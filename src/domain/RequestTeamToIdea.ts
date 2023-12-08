import TeamMember from '@Domain/TeamMember'
import { Skill } from '@Domain/Skill'

interface RequestTeamToIdea {
  ideaId: string
  accepted: boolean
  letter: string
  teamId: string

  id: string
  name: string
  createdAt: string
  closed: boolean
  description: string
  owner: TeamMember
  leader?: TeamMember
  membersCount: number
  members: TeamMember[]
  skills: Skill[]
}

export default RequestTeamToIdea
