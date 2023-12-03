import { Skill } from '@Domain/Skill'
import TeamMember from '@Domain/TeamMember'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'

interface Team {
  id: string
  name: string
  createdAt: string
  description: string
  isClosed: boolean
  membersCount: number
  owner: TeamMember
  leader?: TeamMember
  members: TeamMember[]
  projects?: Project[]
  skills: Skill[]
  wantedSkills: Skill[]
}
interface TeamSkills {
  teamId: string
  totalSkills: Skill[]
  wantedSkills: Skill[]
}
export { Team, TeamSkills }
