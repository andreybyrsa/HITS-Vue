import { User } from '@Domain/User'
import { Team } from '@Domain/Team'

type ProjectStatus = 'ACTIVE' | 'DONE'
type ProjectMemberRole = 'CUSTOMER' | 'TEAM_LEADER' | 'MEMBER'

interface Project {
  id: string

  name: string
  description: string
  customer: string
  initiator: User
  team: Team
  members: ProjectMember[]

  startDate: string
  finishDate: string
  status: ProjectStatus
}

interface ProjectMember {
  projectId: string
  projectName: string
  teamId: string
  teamName: string
  userId: string
  email: string
  firstName: string
  lastName: string
  startDate: string
  finishDate: string | null
  role: ProjectMemberRole
}

export { Project, ProjectMember, ProjectStatus, ProjectMemberRole }
