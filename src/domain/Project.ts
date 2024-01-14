import { Idea } from '@Domain/Idea'
import { User } from '@Domain/User'
import { Team } from '@Domain/Team'

type ProjectStatus = 'ACTIVE' | 'DONE' | 'PAUSED' | 'FAILED'
type ProjectMemberRole = 'CUSTOMER' | 'TEAM_LEADER' | 'DEVELOPER'

interface Project {
  id: string

  idea: Idea
  initiator: User
  team: Team
  members: ProjectMember[]

  startDate: string
  finisDate: string
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

export { Project, ProjectMember }
