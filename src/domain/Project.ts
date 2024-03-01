import { User, Idea, Team } from '@Domain'

export type ProjectStatus = 'ACTIVE' | 'DONE' | 'PAUSED' | 'FAILED'
export type ProjectMemberRole = 'CUSTOMER' | 'TEAM_LEADER' | 'DEVELOPER'

export interface Project {
  id: string

  idea: Idea
  initiator: User
  team: Team
  members: ProjectMember[]

  startDate: string
  finisDate: string
  status: ProjectStatus
}

export interface ProjectMember {
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
