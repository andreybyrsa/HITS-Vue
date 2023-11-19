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
  wantedSkills: Skill[]
  totalSkills: Skill[]
}
interface TeamSkills {
  teamId: string
  teamSkills: Skill[]
}
export { Team, TeamSkills }
